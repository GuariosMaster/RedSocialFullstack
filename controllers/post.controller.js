import { Post } from "../models/Post.js"

export const getPost = async (req, res) => {
    try {
        await Post.find({userId: req.uid})
        return res.json({ ok: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'error de servidor' })
    }
} 

export const createPost = async (req, res) => {
    try {
        const { title, content} = req.body
        const post = new Post({ title, content, userId: req.uid});
        const newPost = await post.save()

        return res.json({ newPost })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'error de servidor' })
    }
}