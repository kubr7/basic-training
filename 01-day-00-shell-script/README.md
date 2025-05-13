**Branch:** `01-assignment-shell-script`

# Shell Script Assignment

## Tasks

1. Create and manage files:
```bash
mkdir ~/sample
touch ~/sample/sample.txt
echo "Hi! This is just a sample text file created using a shell script." > ~/sample/sample.txt
```

2. File operations:
```bash
cat ~/sample/sample.txt                    # View file contents
grep -o 't' ~/sample/sample.txt | wc -l    # Count letter 't'
cp ~/sample/sample.txt ~/sample/sample2.txt # Copy file
```

3. File permissions:
```bash
chmod u+rwx ~/sample/sample.txt  # Owner: Read, Write, Execute
chmod g=r ~/sample/sample.txt    # Group: Read-only
chmod o= ~/sample/sample.txt     # Others: No access
```

4. File manipulation:
```bash
echo "New content" >> ~/sample/sample.txt  # Append content
head -n 50 ~/sample/sample.txt             # View first 50 lines
tail -n 50 ~/sample/sample.txt             # View last 50 lines
```

5. Process management:
```bash
lsof -i :<port>    # View process on port
kill -9 <PID>      # Kill process
```

6. Environment:
```bash
export VAR="value"  # Set environment variable
source ~/.bashrc    # Reload shell configuration
```

## Key Differences
- `source` vs `sh`: source runs in current shell, sh runs in subshell
- `ls` vs `lsof`: ls lists files, lsof shows open files by processes