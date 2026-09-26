const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();


// Allow Angular to connect
app.use((req, res, next) => {

    res.header(
        'Access-Control-Allow-Origin',
        'http://localhost:4200'
    );

    res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,OPTIONS'
    );

    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type'
    );

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();

});


// Allow image data
app.use(
    express.json({
        limit: '15mb'
    })
);


// Main product image folder
const uploadFolder = path.join(
    __dirname,
    'public',
    'assets',
    'images',
    'products'
);


// Upload product image
app.post(
    '/upload-product-image',
    (req, res) => {

        try {

            const {
                fileName,
                fileData,
                category
            } = req.body;


            // Check required data
            if (
                !fileName ||
                !fileData ||
                !category
            ) {

                return res.status(400).json({

                    message:
                        'Image and category are required.'

                });

            }


            // Convert category into folder name
            const categoryFolder =
                category
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9]+/g,
                        '-'
                    );


            // Create category folder
            const folderPath =
                path.join(
                    uploadFolder,
                    categoryFolder
                );


            fs.mkdirSync(
                folderPath,
                {
                    recursive: true
                }
            );


            // Clean file name
            const cleanFileName =
                fileName
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9.-]+/g,
                        '-'
                    );


            // Final image path
            const filePath =
                path.join(
                    folderPath,
                    cleanFileName
                );


            // Remove Base64 prefix
            const base64Data =
                fileData.replace(
                    /^data:image\/\w+;base64,/,
                    ''
                );


            // Save actual image
            fs.writeFileSync(
                filePath,
                Buffer.from(
                    base64Data,
                    'base64'
                )
            );


            // Path stored in db.json
            const imagePath =
                `assets/images/products/${categoryFolder}/${cleanFileName}`;


            console.log(
                'Image saved:',
                imagePath
            );


            // Return path to Angular
            res.json({

                imagePath

            });

        } catch (error) {

            console.error(
                'Upload error:',
                error
            );

            res.status(500).json({

                message:
                    'Failed to upload image.'

            });

        }

    }
);


// Start server
app.listen(
    3001,
    () => {

        console.log(
            'Image upload server running on http://localhost:3001'
        );

    }
);