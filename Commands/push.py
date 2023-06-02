import os;
from datetime import date;
import time

td = date.today();

dt = str(td.day) + "/" + str(td.month) + "/" + str(td.year) + " " + time.strftime("%H:%M:%S");

fl.close();
os.system("git add --all");
os.system("git commit -m \"Update " + dt + "\"");
os.system("git push");

print(dt);



#os.chdir("../");
#os.system();