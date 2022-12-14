const fs = require("fs");

exports.createInflate = (req, res) => {
  //   let url = undefined;
  //   let image = "salut";
  //   let filename = image.replace(/ /g, "_");
  //   const url_folder = "./private/images" + filename;

  const urlLocationprefixe = "./private/images/";

  fs.writeFile(
    urlLocationprefixe + "newfile.txt",
    "Learn Node FS module",
    function (err) {
      if (err) throw err;
      console.log("File is created successfully.");
    }
  );

  return res.json("ca a marché");
};

exports.getFile = (req, res) => {
  return res.json("je suis dans le get");
};
