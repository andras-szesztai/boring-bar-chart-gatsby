import React from "react"
import { Link } from "gatsby"

import { usePosts } from "../../hooks"

const PostPreview = ({ post }) => {
  return (
    <article>
      <h3>
        {" "}
        <Link to={post.slug}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
      <Link to={post.slug}>Read this post</Link>
    </article>
  )
}

export default function() {
  const posts = usePosts()
  return (
    <div>
      {posts.map(post => (
        <PostPreview key={post.slug} post={post} />
      ))}
    </div>
  )
}
