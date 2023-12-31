const { rejects } = require("assert");
const file = require("fs"); 
const { resolve } = require("path");

var posts = [];
var categories = [];

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filterPosts = posts.filter((post) => post.category === category);
    
    if (filterPosts.length === 0) {
      reject("No results returned");
    } else {
      resolve(filterPosts);
    }
  });
}

function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const filterPosts = posts.filter((post) => {
      return new Date(post.postDate) >= new Date(minDateStr);
    });
    
    if (filterPosts.length === 0) {
      reject("No results returned");
    } else {
      resolve(filterPosts);
    }
  });
}

function getPostById(id) {
  return new Promise((resolve, reject) => {
    const foundPost = posts.find((post) => post.id === id);
    
    if (foundPost) {
      const formattedPost = {
        id: foundPost.id,
        title: foundPost.title,
        body: foundPost.content,
        postDate: foundPost.postDate,
        category: foundPost.category,
        featureImage: foundPost.featureImage,
        published: foundPost.published
      };
      resolve(formattedPost);
    } else {
      reject("No result returned");
    }
  });
}


function addPost(postData) {
  return new Promise((resolve, reject) => {
    if (typeof postData.published === 'undefined') {
      postData.published = false;
    } else {
      postData.published = true;
    }
    
    postData.id = posts.length + 1;
    
    posts.push(postData);
    
    resolve(postData);
  });
}

initialize = function () {
  return new Promise((resolve, reject) => {
    file.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) {
        reject("unable to read file");
      } else {
        posts = JSON.parse(data);
      }
    });

    file.readFile("./data/categories.json", "utf8", (err, data) => {
      if (err) {
        reject("unable to read file");
      } else {
        categories = JSON.parse(data);
      }
    });
    resolve();
  });
};

getAllPosts = function () {
  return new Promise((res, rej) => {
    if (posts.length === 0) {
      rej("no results returned");
    } else {
      res(posts);
    }
  });
};

getPublishedPosts = function () {
  return new Promise((res, rej) => {
    var filterPosts = [];
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].published === true) {
        filterPosts.push(posts[i]);
      }
    }

    if (filterPosts.length === 0) {
      rej("no results returned");
    } else {
      res(filterPosts);
    }
  });
};

getCategories = function () {
  return new Promise((res, rej) => {
    if (categories.length === 0) {
      rej("no results returned");
    } else {
      res(categories);
    }
  });
};

module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById,
};