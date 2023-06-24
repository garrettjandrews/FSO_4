const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let res = 0

    if (blogs.length === 0) {
        return 0
    }

    blogs.forEach(blog => {
        if (blog.likes) {
            res += blog.likes
        }
    })

    return res
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return "No blogs"
    }

    let max_likes = 0
    let max_index = 0
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > max_likes) {
            max_likes = blogs[i].likes
            max_index = i
        }
    }

    return blogs[max_index]
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return "No blogs"
    }

    const authors = lodash.groupBy(blogs, "author")
    let max_author;
    let max_posts = 0;

    for (author in authors) {
        if (authors[author].length > max_posts) {
            max_posts = authors[author].length
            max_author = author
        }
    }

    const result = {
        author: max_author,
        blogs: max_posts
    }

    return result
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return "No blogs"
    }

    const authors = lodash.groupBy(blogs, "author")
    let max_author;
    let max_likes = 0;
    let this_sum;

    for (author in authors) {
        this_sum = 0;

        authors[author].forEach(post => {
            this_sum += post.likes
        })

        if (this_sum > max_likes) {
            max_likes = this_sum
            max_author = author
        }
    }

    const result = {
        author: max_author,
        likes: max_likes
    }

    return result
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }