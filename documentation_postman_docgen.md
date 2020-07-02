# Documentation using docgen

when v noviagte to localhost:5000/ user need to see the documentation.
Documentation means explaining the outes - what it issupposed to do?
For that purpose we use docgen.
Docgen -> To create html files with documentation and put
in our index page. ie. [LOCALHOST](http://localhost:5000/)

- docgen github:
  [DOCGEN](https://github.com/thedevsaddam/docgen)

- create a copy of our environment.

- change environment NAME.

- export the collection.

- install docgen

  ```bash
  curl https://raw.githubusercontent.com/thedevsaddam/docgen/v3/install.sh -o install.sh && sudo chmod +x install.sh && sudo ./install.sh
  ```

- navigate to folder where v saved the collection exported.

```bash
 docgen build -i DevCamper\ Api.postman_collection.json -o index.html
```

here the documentation is genrated in index.html

- next vhave to show this index.html while navigate http://localhost:5000

- to do that just copy that index.html to public folder in our project dir.

- then run, http://localhost:5000 :)
