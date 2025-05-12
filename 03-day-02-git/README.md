# 📜 Day 0 - Shell Script Assignment  
**File:** `Basic_Training_Day_0_Shell_Script_Assignment.sh`  
**Author:** `<kubr7>`

---

## 📂 Objective
The objective of this assignment is to practice fundamental shell scripting and Linux commands. It includes file and folder manipulations, text operations, permission changes, process handling, and understanding command differences.

---

### ❓ Q1: Tasks & Commands

### ✅ a. Create a folder named `sample` in your home directory:
```bash
mkdir ~/sample
```

### ✅ b. Create a file named `sample.txt` inside `sample` folder:
```bash
touch ~/sample/sample.txt
```

### ✅ c. Add content to the file:
```bash
echo "Hi! This is just a sample text file created using a shell script." > ~/sample/sample.txt
```

### ✅ d. Print the contents of the file:
```bash
cat ~/sample/sample.txt
```

### ✅ e. Count occurrences of letter `t`:
```bash
grep -o 't' ~/sample/sample.txt | wc -l
```

### ✅ f. Change **owner** permissions to Read, Write, Execute:
```bash
chmod u+rwx ~/sample/sample.txt
```

### ✅ g. Append more content to `sample.txt`:
```bash
echo "Hi! This is just another sample text added to the file." >> ~/sample/sample.txt
```

### ✅ h. Allow **group** read-only permission:
```bash
chmod g=r ~/sample/sample.txt
```

### ✅ i. Deny **others** any access:
```bash
chmod o= ~/sample/sample.txt
```

### ✅ j. Create `sample2.txt` with the same content as `sample.txt`:
```bash
cp ~/sample/sample.txt ~/sample/sample2.txt
```

### ✅ k. Add 1000 random lines to `sample.txt`:
```bash
yes "This is a random line." | head -n 1000 >> ~/sample/sample.txt
```

### ✅ l. Print the **top 50 lines** of `sample.txt`:
```bash
head -n 50 ~/sample/sample.txt
```

### ✅ m. Print the **bottom 50 lines** of `sample.txt`:
```bash
tail -n 50 ~/sample/sample.txt
```

### ✅ n. Create 5 more files:
```bash
touch ~/sample/prog1.txt ~/sample/prog2.txt ~/sample/program.txt ~/sample/code.txt ~/sample/info.txt
```

### ✅ o. List files with `"prog"` in the name:
```bash
ls ~/sample | grep 'prog'
```

### ✅ p. Create an alias `list` for the above:
```bash
alias list='ls ~/sample | grep prog'
```
Now, run:
```bash
list
```

---


### ❓ Q2: What is the difference between `source` and `sh`?
- `source` runs a script **in the current shell**, so any environment variable or function remains available.
- `sh` executes the script in a **subshell**, so any changes made to the environment do **not** persist in the current shell.

### ❓ Q3: Create `a.txt` and `b.txt`, find differences:
```bash
diff a.txt b.txt
```

### ❓ Q4: What is the difference between `ls` and `lsof`?
- `ls`: Lists **files and directories**.
- `lsof`: Lists **open files** by **active processes** (used for debugging, port usage, etc).

### ❓ Q5: Create nested directories (`hello/world`) in a single command:
```bash
mkdir -p ./hello/world
```

### ❓ Q6: How to permanently set an environment variable:
Edit `~/.bashrc` or `~/.bash_profile`:
```bash
export MY_VAR="my_value"
```
Then reload:
```bash
source ~/.bashrc
```

### ❓ Q7: View and kill a process on a port:
To check:
```bash
lsof -i :<port_number>
```
Example:
```bash
lsof -i :3000
```
To kill:
```bash
kill -9 <PID>
```

---

## 🧠 Summary
This assignment strengthens basic Linux shell scripting knowledge, command-line fluency, and system operation awareness—essential for developers and system administrators alike.

---