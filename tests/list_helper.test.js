const listHelper = require('../utils/list_helper.js')

describe("dummy", () => {
    test("dummy returns one", () => {
        const blogs = []

        expect(listHelper.dummy(blogs)).toBe(1)
    })
})

describe("total likes tests", () => {
    const listWithOneBlog = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 5
        }
    ]

    const listWithTwo = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 3
        },
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 4
        }
    ]

    const listWithInvalid = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 3
        },
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol"
        }
    ]

    test("empty list returns 0", () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test("list with one blog should just be that list", () => {
        expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
    })

    test("list with two valid blogs should be sum", () => {
        expect(listHelper.totalLikes(listWithTwo)).toBe(7)
    })

    test("list with missing likes", () => {
        expect(listHelper.totalLikes(listWithInvalid)).toBe(3)
    })
})

describe("favorite blog", () => {
    const listWithOneBlog = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 5
        }
    ]

    const listWithTwo = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 3
        },
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 4
        }
    ]

    const listWithInvalid = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 3
        },
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol"
        }
    ]

    test("empty returns 'No blogs'", () => {
        expect(listHelper.favoriteBlog([])).toBe("No blogs")
    })

    test("one blog should return that entry", () => {
        expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0])
    })

    test("two blogs", () => {
        expect(listHelper.favoriteBlog(listWithTwo)).toEqual(listWithTwo[1])
    })

    test("one blog with missing likes", () => {
        expect(listHelper.favoriteBlog(listWithInvalid)).toEqual(listWithInvalid[0])
    })
})

describe("most blogs", () => {
    const listWithOneBlog = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 5
        }
    ]

    const listWithTwo = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 3
        },
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 4
        }
    ]

    const listWithInvalid = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 3
        },
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol"
        },
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "lauren",
            url: "lol"
        }
    ]

    test("no blogs", () => {
        expect(listHelper.mostBlogs([])).toBe("No blogs")
    })

    test("one post", () => {
        expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
            author: "g money",
            blogs: 1
        })
    })

    test("one author with multiple posts", () => {
        expect(listHelper.mostBlogs(listWithTwo)).toEqual({
            author: "g money",
            blogs: 2
        })
    })

    test("multiple posts with multiple authors", () => {
        expect(listHelper.mostBlogs(listWithInvalid)).toEqual({
            author: "g money",
            blogs: 2
        })
    })
})

describe("most likes", () => {
    const listWithOneBlog = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 5
        }
    ]

    const listWithTwo = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 3
        },
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 4
        }
    ]

    const listWithInvalid = [
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol",
            likes: 3
        },
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "g money",
            url: "lol"
        },
        {
            _id:"first_id",
            __v: 0,
            title: "Who cares",
            author: "lauren",
            url: "lol",
            likes: 10
        }
    ]

    test("no blogs", () => {
        expect(listHelper.mostLikes([])).toBe("No blogs")
    })

    test("one post", () => {
        expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
            author: "g money",
            likes: 5
        })
    })

    test("one author with multiple posts", () => {
        expect(listHelper.mostLikes(listWithTwo)).toEqual({
            author: "g money",
            likes: 7
        })
    })

    test("multiple posts with multiple authors", () => {
        expect(listHelper.mostLikes(listWithInvalid)).toEqual({
            author: "lauren",
            likes: 10
        })
    })
})