#!/usr/bin/env node

import { Command } from 'commander';
import runner from './runner.js';
const program = new Command();

program.version('1.0.0').description('Run your K6 tests locally');

program
  .command('test')
  .description('Select your test scenario and your test type and run it locally')
  .action(async () => {
    await runner();
  });

program.parse(process.argv);
