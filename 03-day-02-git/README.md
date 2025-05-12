# 📘 Day 3 - Git Assignment  
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