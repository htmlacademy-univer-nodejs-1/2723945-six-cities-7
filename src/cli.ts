#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import chalk from 'chalk';

import { generateOffersFile } from './offer-generator.js';
import { readOffersFromFileStream } from './tsv-file-reader.js';
import { randomBytes } from 'node:crypto';

import { restContainer } from './rest/rest-container.js';
import { Component } from './shared/types/index.js';
import { getMongoURI, createSHA256 } from './shared/helpers/index.js';
import { DatabaseClient } from './shared/libs/database-client/index.js';
import { UserService, DefaultOfferService } from './shared/libs/services/index.js';
import { OfferEntity } from './shared/libs/models/index.js';

function printHelp(): void {
  console.log(chalk.bold.cyan('Программа для подготовки данных для REST API сервера.'));
  console.log('');
  console.log(chalk.bold.yellow('Пример: cli.js --<command> [--arguments]'));
  console.log('');
  console.log(chalk.bold('Команды:'));
  console.log(`${chalk.green('--version')}                      ${chalk.dim('выводит номер версии')}`);
  console.log(`${chalk.green('--help')}                         ${chalk.dim('печатает этот текст')}`);
  console.log(`${chalk.green('--import <filepath> <login> <password> <host> <dbname> <salt>')} ${chalk.dim('импортирует данные в MongoDB')}`);
  console.log(`${chalk.green('--generate <n> <path> <url>')}    ${chalk.dim('генерирует произвольное количество тестовых данных')}`);
}

function getAppVersion(): string {
  const packageUrl = new URL('../package.json', import.meta.url);
  const packageJson = JSON.parse(readFileSync(packageUrl, 'utf-8')) as { version?: string };

  return packageJson.version ?? 'unknown';
}

function printVersion(): void {
  console.log(getAppVersion());
}

async function handleImport(args: string[]): Promise<void> {
  const [filepath, login, password, host, dbName, salt] = args;

  if (args.length !== 6 || args.some((arg) => !arg)) {
    console.error(
      chalk.red('Ошибка: ожидаются аргументы <filepath> <login> <password> <host> <dbname> <salt>.')
    );
    process.exitCode = 1;
    return;
  }

  const databaseClient = restContainer.get<DatabaseClient>(
    Component.DatabaseClient
  );

  let isConnected = false;

  try {
    const uri = getMongoURI(login, password, host, 27017, dbName);
    await databaseClient.connect(uri);
    isConnected = true;

    console.log(chalk.green('Подключение к MongoDB установлено.'));

    const userService = restContainer.get<UserService>(Component.UserService);
    const offerService = restContainer.get<DefaultOfferService>(Component.OfferService);

    const importedCount = await readOffersFromFileStream(filepath, async (offer) => {
      const user = await userService.findOrCreate({
        ...offer.author,
        password: createSHA256(randomBytes(32).toString('hex'), salt),
      });

      await offerService.create({
        ...offer,
        publicationDate: new Date(offer.publicationDate),
        author: user._id,
      } as OfferEntity);
    });

    console.log(chalk.green(`Импортировано предложений: ${importedCount}.`));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка.';
    console.error(chalk.red(`Ошибка импорта: ${message}`));
    process.exitCode = 1;
  } finally {
    if (isConnected) {
      await databaseClient.disconnect();
    }
  }
}

async function handleGenerate(
  countArgument: string | undefined,
  filepathArgument: string | undefined,
  urlArgument: string | undefined,
  argumentCount: number,
): Promise<void> {
  if (!countArgument || !filepathArgument || !urlArgument || argumentCount !== 3) {
    console.error(chalk.red('Ошибка: используйте --generate <n> <filepath> <url>.'));
    process.exitCode = 1;
    return;
  }

  try {
    const count = await generateOffersFile(countArgument, filepathArgument, urlArgument);
    console.log(chalk.green(`Сгенерировано ${count} предложений в ${filepathArgument}.`));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка генерации.';
    console.error(chalk.red(`Ошибка генерации: ${message}`));
    process.exitCode = 1;
  }
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    printHelp();
    return;
  }

  switch (command) {
    case '--help':
      printHelp();
      break;
    case '--version':
      printVersion();
      break;
    case '--import':
      await handleImport(args);
      break;
    case '--generate':
      await handleGenerate(args[0], args[1], args[2], args.length);
      break;
    default:
      console.error(chalk.red(`Неизвестная команда: ${command}`));
      console.error('');
      printHelp();
      process.exitCode = 1;
  }
}

void main();
