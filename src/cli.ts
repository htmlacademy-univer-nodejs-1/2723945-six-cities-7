#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import chalk from 'chalk';

import { generateOffersFile } from './offer-generator.js';
import { readOffersFromFileStream } from './tsv-file-reader.js';

function printHelp(): void {
  console.log(chalk.bold.cyan('Программа для подготовки данных для REST API сервера.'));
  console.log('');
  console.log(chalk.bold.yellow('Пример: cli.js --<command> [--arguments]'));
  console.log('');
  console.log(chalk.bold('Команды:'));
  console.log(`${chalk.green('--version')}                      ${chalk.dim('выводит номер версии')}`);
  console.log(`${chalk.green('--help')}                         ${chalk.dim('печатает этот текст')}`);
  console.log(`${chalk.green('--import <filepath>')}            ${chalk.dim('импортирует данные из TSV')}`);
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

async function handleImport(filepathArgument: string | undefined): Promise<void> {
  if (!filepathArgument) {
    console.error(chalk.red('Ошибка: укажите путь к TSV-файлу после команды --import.'));
    process.exitCode = 1;
    return;
  }

  try {
    const offerCount = await readOffersFromFileStream(filepathArgument, (offer) => {
      console.log(chalk.cyan(`- ${offer.name}`));
    });

    console.log(chalk.green(`Импортировано ${offerCount} предложений из ${filepathArgument}.`));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка импорта.';
    console.error(chalk.red(`Ошибка импорта: ${message}`));
    process.exitCode = 1;
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
      await handleImport(args[0]);
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
