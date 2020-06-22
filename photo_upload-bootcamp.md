# uploading Photo for Bootcamp

- delete all bootcamps and courses.

## install express-fileupload

- Have a Look:

<https://github.com/richardgirges/express-fileupload>

```bash
npm i express-fileuplaod
```

- set configurations

**config/confg.env**

```javascript
FILE_UPLOAD_PATH = ./public/uploads
MAX_FILE_UPLOAD = 1000000

//  1000000 BYTES = 1 MB

```

- next **create a controller for photo upload** in bootcamp.

**controllers/bootcamp.js**

```javascript
// @desc - Upload a Photo for Bootcamp
// @route - PUT /api/v1/bootcamp/:id/photo
// @access - Private,

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  // find the document by Id,
  const bootcamp = await Bootcamp.findById(req.params.id);
  // if no bootcamp found,
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400)
    );
  }
  // if found - but file not uploaded
  if (!req.files) {
    return next(new ErrorResponse(`Photo not Uplaaded`, 400));
  }
  console.log(req.files.file); // gives an object

  const file = req.files.file;

  // if mimetype is not image. check file type
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please uplaod an image`, 400));
  }

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`photo size dont exceed 1MB`), 400);
  }

  // create custom file name - parse the file extension,
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log(file.name); //photo_<bootcampId>.jpg

  // move the file to public/uploads folder in root,
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse(`photo upload failed`, 500));
    }
    // insert file.name to Bootcamp Model as new field,
    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });
    // send back the repsone -> client
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
```

```javascript

console.log(req.files.file);

// result is,
{
  name: 'bootcamp.jpg',
  size: 53179,
  encoding: '7bit',
  tempFilePath: '',
  truncated: false,
  mimetype: 'image/jpeg',
  md5: '920256246b117a4bd4dd114429871697',
  mv: [Function: mv]
}
```

**routes/bootcamp.js**

```javascript
// route for bootcamp photo uplaod
router.route('/:id/photo').put(bootcampPhotoUpload);
```

**server.js**

```javascript
// use express-fileupload module here
app.use(fileupload());

// set public as our static folder,
app.use(express.static(path.join(path.dirname('./'), 'public')));
```

---

- create a _public_ and _uploads_ folder

```shell
mkdir -v public
cd public
mkdir -v uploads
```

---

## upload photo from postman

set **Content-Type** as _multipart/form-data_.

- In **body**, choose _form-data_ choose _file_ as key,
  and select file for photo upload.

- send the request.

- can view the screenshots here,

  ![image](./screenshots/postman_image_upload_1.png 'image')
  ![image](./screenshots/postman_image_upload_2.png 'image')

---

- we can view the image uploaded from browser,

<http://localhost:5000/uploads/photo_5d713a66ec8f2b88b8f830b8.jpg>

---
