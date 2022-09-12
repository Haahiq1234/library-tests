import os;
import time;

def join(arr, jn):
    name = "";
    ln = len(arr);
    for i in range(ln):
        nm = str(arr[i]);
        print(nm);
        if i > 0:
            nm += jn;
        name += nm;
    return name;

def add(*fn):
    name = join(fn, " ");
    print(name);

def push():
    os.system("push.bat");

def quitProg():
    print("Quitting");
    #time.sleep(2);
    quit();
    pass;
funcs = {"add": add, "push": push, "quit": quitProg, "" : quitProg, "exit": quitProg};

while True:
    keys = input("Enter Command: ").split(" ");
    if len(keys) == 0:
        print("quitting");
        quit();
    else:
        #print(funcs);
        keyy = keys.pop(0);
        print(keys);
        if len(keys) == 0:
            funcs[keyy]();
        else:
            funcs[keyy](*keys);