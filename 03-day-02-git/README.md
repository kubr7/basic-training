**Branch:** `03-assignment-git`
**File:** `Basic_Training_Day_2_Git_Assignment.sh`

# Git Assignment

## Objective
Practice basic Git operations including repository setup, committing, staging, pushing, and cloning.

## Steps

1. Create a private GitHub repo named `i-am-a-git-noob`

2. Set up local repository:
```bash
mkdir i-am-a-git-noob
cd i-am-a-git-noob
git init
git remote add origin https://github.com/kubr7/i-am-a-git-noob.git
```

3. Configure Git:
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

4. Create and modify test file:
```bash
echo "first line in file" > test1.txt
git add test1.txt
git commit -m "Initial commit"
git push -u origin master
```

5. Make changes and commit:
```bash
echo "second line in file" >> test1.txt
git add test1.txt
git commit -m "Added second line"
git push origin master
```

6. Practice Git operations:
- Amend commit message: `git commit --amend -m "New message"`
- Force push: `git push --force origin master`
- View history: `git log --oneline`
- Revert commit: `git revert HEAD`
- Clone repo: `git clone https://github.com/kubr7/i-am-a-git-noob.git`

## Summary
This assignment covers essential Git workflows for version control and collaboration.