#!/usr/bin/env python
from typing import List, Tuple
import getopt
import sys
import os
import subprocess

USAGE = f"Usage: python {sys.argv[0]} [--help] | [-c <command>] [-t <type format output> ]"
VERSION = f"{sys.argv[0]} version 1.0.0"
COMMAND_ERROR = f"PROBLEM: Using command to capture output "

def seq(operands: List[int], sep: str = "\n"):
    first, increment, last = 1, 1, 1
    if len(operands) == 1:
        last = operands[0]
    elif len(operands) == 2:
        first, last = operands
        if first > last:
            increment = -1
    elif len(operands) == 3:
        first, increment, last = operands
    last = last - 1 if first > last else last + 1
    return sep.join(str(i) for i in range(first, last, increment))

def  launch(command):
    print('Command {c} is going to be launched now'.format(c=command))
    if os.geteuid() == 0:
        print("root user!")
        process = subprocess.run([command], 
                         stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE,
                         universal_newlines=True)
        return process.stdout

    else:
        print("We're not root.")
        process = subprocess.run([command], 
                         stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE, 
                         universal_newlines=True)
        print(process.stdout)                         
        return process.stdout

def parse(args: List[str]):
    options, arguments = getopt.getopt(
        args,                              # Arguments
        'vhc:t:',                            # Short option definitions
        ["version", "help", "command=","type="]) # Long option definitions
    output_type = None
    output_command = None
    mycommand=None
    for o, a in options:
        if o in ("-v", "--version"):
            print(VERSION)
            sys.exit()
        if o in ("-h", "--help"):
            print(USAGE)
            sys.exit()
        if o in ("-t", "--type"):
            output_type = a    
        if o in ("-c", "--command"):
            mycommand=a
            output_command = launch(a)
  
    if not arguments or len(arguments) > 1:
        print("Arguments are not used rigth now") # Argument example -c 'cat' halo.txt, so arguemnts lenght is 1 
        
    try:
        if output_command is None:
            ERROR =" ".join((COMMAND_ERROR,mycommand))
            raise SystemExit(ERROR)
    except:
        raise SystemExit(USAGE)
    return mycommand,output_command,output_type

def main():
    args = sys.argv[1:]
    if not args:
        raise SystemExit(USAGE)
    command, output_command, type_output = parse(args)
    print('Command {c} is going to be launched now and its output will be showed in {t} format'.format(c=command,t=type_output))
    print('Command Output {c}'.format(c=output_command))
if __name__ == "__main__":
    main()