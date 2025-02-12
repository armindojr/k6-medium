import fs from 'fs/promises';
import * as colorette from 'colorette';
import { checkbox, select } from '@inquirer/prompts';
import { spawn } from 'child_process';

const TYPES_DIR = './src/testType/';
const TEST_DIR = './src/specs/';

async function readFiles(dir) {
  try {
    const files = await fs.readdir(dir);
    return files.length === 0 ? ['-'] : files;
  } catch (error) {
    console.error(colorette.red(`Error reading directory: ${dir}`));
    throw error;
  }
}

function removeExt(str) {
  const regex = /(\.\w+)+$/;
  return str.replace(regex, '');
}

async function getUserInput() {
  const url = 'https://grafana.com/docs/k6/latest/testing-guides/test-types/';
  const typesChoices = await readFiles(TYPES_DIR);
  const filesChoices = await readFiles(TEST_DIR);

  const testType = await select({
    message: `What type of test you will run? More info: ${url}`,
    choices: typesChoices
  });

  const files = await checkbox({
    message: 'Choose your test spec that will run:',
    choices: filesChoices,
    theme: {
      helpMode: 'always'
    }
  });

  const testTypeWithoutExt = removeExt(testType);
  const filesWithoutExt = files.map(x => removeExt(x));

  return { testType: testTypeWithoutExt, files: filesWithoutExt };
}

async function runK6(testType, fileName) {
  let file = Array.isArray(fileName) ? fileName.join(',') : fileName;

  // Command that will run k6 tests on docker
  const baseCommand = [
    'compose',
    'run',
    '--rm',
    'load-test',
    'run',
    '-e',
    'testFilters=true',
    '-e',
    `filterValue=${file}`,
    '-e',
    `testType=${testType}`,
    '/scripts/main.js'
  ];

  console.log(
    colorette.green('✔ ') +
      colorette.bold(colorette.blue(`Starting k6 tests on docker: `)) +
      colorette.greenBright(`docker ${baseCommand.join(' ')}`)
  );

  // Spawn child process using k6 command and inherit it stdio output
  const child = spawn('docker', baseCommand, { stdio: 'inherit' });

  child.on('close', code => {
    if (code !== 0) {
      throw new Error(`Child process exited with code ${code}`);
    } else {
      console.log(colorette.gray('Child process terminated with code 0'));
    }
  });
}

export default async function runner() {
  try {
    const userInput = await getUserInput();

    // Validate inputs
    if (userInput.testType === '-') {
      throw new Error('Config file not found! Please create one.');
    }

    for (const file of userInput.files) {
      if (file === '-') {
        throw new Error('Test file not found! Please create one.');
      }
    }

    await runK6(userInput.testType, userInput.files);
  } catch (error) {
    console.error(colorette.red(`Error on runner!`));
    throw error;
  }
}
