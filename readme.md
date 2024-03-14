## Description
    Problem Statement: Built an application to manage E-Commerce Fashion categories in a tree structure

    Data Sample:    
        -Women
            - Clothing
                - Dresss
                    - Causal Dresses
                    - Party Dresses
            - T-Shirts
                - Printed T-shirts
                - Causal T-Shirts
                - Plain T-Shirts
        -Men
            - Footwear
                - Branded
                - Non Branded
            - T-Shirts
                - Printed T-shirts
                - Causal T-Shirts
                - Plain T-Shirts
            - Shirts
                - Party Shirts
                - Causal Shirts
                - Plain Shirts

## Task

    Design an api that can display the categories in Hierarchical(Tree View) in N number of levels
    Design 3 API endpoint that will create/update/delete categories
    Display the category in tree structure.

## Requirements

    The API should follow typical RESTful API design pattern.
    The data should be saved in the DB.
    Provide proper unit test

## Installing Dependencies

```bash
$ npm install
```

## Running The App

```bash
# production mode
npm start

# development mode
npm run dev
```

## Running Test Cases

```bash
npm run test
```
   
## cURLs

1.  Add New Category [POST]

```bash
    curl --location 'localhost:3088/category' \
    --header 'Content-Type: application/json' \
    --data '{
        "name": "Plain T-Shirts",
        "parent": "65f1ad0144b738e90a6dd517"
    }'
```

2. List Categories [GET]
    
```bash
    curl --location 'localhost:3000/categories?depthLevel=4&limit=2'
```

3. Update Category [PUT]
        
```bash
   curl --location --request PUT 'localhost:3088/category/65f27a895cd1f5a22e3e8b19' \
    --header 'Content-Type: application/json' \
    --data '{
        "name": "Plain T-Shirts - update",
        "parent": "65f1ad0144b738e90a6dd517"
    }'
```

3. Delete Category [PUT]

```bash
    curl --location --request DELETE 'localhost:3000/category/65f1b35f1083a004ad2158ca'
```

## Category Collection View

    https://github.com/dibyenduswar/lmg-assesment-nested-categories-for-ecommerce/blob/master/img/mongo-table-data.png

![alt text](https://github.com/dibyenduswar/lmg-assesment-nested-categories-for-ecommerce/blob/master/img/mongo-table-data.png)
    
## Category List View

    https://github.com/dibyenduswar/lmg-assesment-nested-categories-for-ecommerce/blob/master/img/category-list-view.png

![alt text](https://github.com/dibyenduswar/lmg-assesment-nested-categories-for-ecommerce/blob/master/img/category-list-view.png)

## Stay in touch

- Author - Dibyendu Swar
- LinkedIn - [https://www.linkedin.com/in/dibyendu-swar/]

## Note
1.  For simplicity, all code is contained within a single JavaScript file.
2.  Request validation is omitted for simplicity. In a production environment, it's essential to include proper request validation.
3.  Environment variables or a secret manager should be used to securely store sensitive information like the MongoDB URI. 
4.  This temporary MongoDB URI will be active until 24.03.2024.
