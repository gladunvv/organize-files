# organize-files

Node.js приложение для сортировки mp3 файлов.




## Краткое описание: 
Приложение при запуске принимает на вход три дополнительных параметра, два из которых обязательны (исходная и конечная директория) третий не обязательный (разрешение на удалене исходной директории). Приложение копирует файлы формата mp3 в указанную директорию сортируя и раскладывая по папкам в алфавитном порядке, таким образом все файлы начинающиеся на 'а' попадут в папку 'A'.       
Для удаления исходной директории следует передавать 'rmd'.      

Таким образом по команде       
```bash
 ~/.../organize-files npm start files newdir rmd
```
приложение скопирует и отсортирует все mp3 файлы из files в newdir затем полностью удалит files.   
