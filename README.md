# Basic Training Assignments

This repository contains multiple assignments as part of the **Basic Training Program**. Each assignment focuses on core concepts across programming, tools, and development workflows.

## Repository Structure

Each assignment is organized under a **dedicated branch**:

| Branch Name                   | Assignment Topic         | Description                                                                    |
|-------------------------------|--------------------------|--------------------------------------------------------------------------------|
| `01-assignment-shell-script`  | Shell Scripting Basics   | First assignment covering shell commands, permissions, and scripting logic.    |
| `02-assignment-git`           | Git & GitHub             | Second assignment focusing on Git commands, workflows, and GitHub usage.       |
| `03-assignment-javascript`    | JavaScript               | Third assignment focusing on array, object, recursion logic and DSA.           |
| `04-assignment-web`           | Web Concepts             | Fourth assignment developing api endpoints for application using Nestjs.       |



> _Note: Switch to the respective branch to view the code for each assignment._

---


## Shell Script Assignment – Branch: `01-assignment-shell-script` 
# 📜 Day 0 - Shell Script Assignment
**Branch:** `01-assignment-shell-script`
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


## JavaScript Assignment – Branch: `03-assignment-javascript`
# 📜 Day 2 - JavaScript Assignment  
**Branch:** `03-assignment-javascript`
**File:** `Basic_Training_Day_2_JavaScript_Assignment.sh`
**Author:** `<kubr7>`

---

This assignment demonstrates several key JavaScript concepts through four problems:

### Problems Implemented

1. **`secondLargest(array)`**
   - Finds the second largest number without using `.sort()`.
   - Manages edge cases and input validation.

2. **`calculateFrequency(string)`**
   - Counts character frequency using arrays (no built-in methods).
   - Focuses on lowercase ASCII letters only.

3. **`flatten(unflatObject)`**
   - Flattens nested JavaScript objects or arrays into dot-notated keys.

4. **`unflatten(flatObject)`**
   - Reconstructs nested structure from a flattened dot-notated object.

### Concepts Practiced

- Array manipulation and conditionals  
- Manual frequency calculation using ASCII  
- Recursive object traversal  
- Type checking and nesting logic  

---

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/basic-training.git





## Git Assignment – Branch: `03-assignment-git`
# 📘 Day 3 - Git Assignment
**Branch:** `03-assignment-git`  
**File:** `Basic_Training_Day_3_Git_Assignment.sh`  
**Author:** `<kubr7>`  

---

## 🎯 Objective
The goal of this assignment is to reinforce basic Git concepts including repository setup, committing, staging, pushing, editing commit history, and cloning. The assignment walks through a realistic Git workflow scenario.

---

## 📝 Steps and Commands

### ✅ 1. Create a private GitHub repo:
- Repo Name: `i-am-a-git-noob`

### ✅ 2. Create a local repository (without cloning):
```bash
mkdir i-am-a-git-noob
cd i-am-a-git-noob
git init
```

### ❓ Q: What changes did you observe?
**A:** A hidden `.git` directory is created in the current folder, which contains all the configuration, history, and metadata for the repo.

---

### ✅ 3. Add the remote URL:
```bash
git remote add origin https://github.com/<your-username>/i-am-a-git-noob.git
```

### ✅ 4. Print current Git configuration:
```bash
git config --list
```

### ✅ 5. Set Git config for current repo:
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

### ✅ 6. Create `test1.txt`:
```bash
touch .test1.txt
```
---

### ✅ 7. Add line "first line in file" in test1.txt:
```bash
echo "first line in file" > test1.txt
```

### ✅ 8. Stage and commit the file, then push:
```bash
git add test1.txt
git commit -m "Initial commit"
git push -u origin master
```

---

### ✅ 9. Append "second line in file":
```bash
echo "second line in file" >> test1.txt
```

### ✅ 10. Add to staging area:
```bash
git add test1.txt
```

### ✅ 11. Check status:
```bash
git status
```

---

### ✅ 12. Append "third line in file":
```bash
echo "third line in file" >> test1.txt
```

```bash
git status
```

---

### ✅ 13. Remove from staging:
```bash
git reset test1.txt
```

---

### ✅ 14. Create a commit:
```bash
git add test1.txt
git commit -m "My First Commit"
```

### ✅ 15. Push commit:
```bash
git push origin master
```

---

### ✅ 16. Change commit message to "My Second Commit":
```bash
git commit --amend -m "My Second Commit"
git push --force origin master
```

---

### ✅ 17. Push commit with the updated message:
```bash
git push --force origin master
```

---

### ✅ 18. View commit differences:
```bash
git log --oneline
git diff HEAD~1 HEAD
```

---

### ✅ 19. Revert last commit:
```bash
git revert HEAD
git log --oneline
```

---

### ✅ 20. Add "Fourth line in file" and commit:
```bash
echo "Fourth line in file" >> test1.txt
git add test1.txt
git commit -m "Added fourth line"
```

### ✅ 21. Update last commit with "Fifth line in file" (no new commit):
```bash
echo "Fifth line in file" >> test1.txt
git add test1.txt
git commit --amend --no-edit
git push --force origin master
```

---

### ✅ 22. Push the updated commits :
```bash
git commit --amend --no-edit
git push --force origin master
```

---

### ✅ 23. Append more content:
```bash
echo "Another appended line" >> test1.txt
```

### ✅ 24. Pull remote changes:
```bash
git pull origin master
```

---

### ✅ 25. Clone repo to another directory:
```bash
cd ..
git clone https://github.com/<your-username>/i-am-a-git-noob.git cloned-i-am-a-git-noob
```

---

## ✅ Summary
This assignment reinforces core Git workflows such as staging, committing, pushing, changing commit messages, handling conflicts, and cloning repositories. These are essential skills for collaborative software development.

---

