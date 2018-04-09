cd messages/

shopt -s nullglob
numfiles=(*)
numfiles=${#numfiles[@]}

numdirs=(*/)
numdirs=${#numdirs[@]}
(( numfiles -= numdirs ))

echo "FILENUM:$numfiles" > ../fileinfo.txt

echo "FILETYPE" >> ../fileinfo.txt
find ./files -type f | grep -E ".*\.[a-zA-Z0-9]*$" | sed -e 's/.*\(\.[a-zA-Z0-9]*\)$/\1/' | sort | uniq -c | sort -n >> ../fileinfo.txt

cd ..

open -a FireFox index.html

