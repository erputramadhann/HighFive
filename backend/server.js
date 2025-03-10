const jsonServer = require("json-server")
const auth = require("json-server-auth")
const cors = require("cors")

const databases = [
  { file: "db1.json", port: 3001 },
  { file: "db2.json", port: 3002 },
  { file: "db3.json", port: 3003 },
  { file: "db4.json", port: 3004 },
  { file: "db5.json", port: 3005 },
  { file: "db6.json", port: 3006 },
]

databases.forEach(({ file, port }) => {
  const server = jsonServer.create()
  const router = jsonServer.router(file)
  const middlewares = jsonServer.defaults()

  // Enable CORS
  server.use(cors())
  server.use(middlewares)

  server.post("/wishlist", (req, res, next) => {
    const { userId, ...wishlistData } = req.body
    req.body = { ...wishlistData, createdAt: new Date().toISOString() }
    next()
  })

  server.use((req, res, next) => {
    if (req.method === "DELETE" && req.path.startsWith("/products/")) {
      const user = req.user

      if (user && user.role === "admin") {
        return router.db
          .get("products")
          .remove({ id: Number(req.params.id) })
          .write()
          .then(() => res.status(200).json({ message: "Product deleted successfully" }))
          .catch(() => res.status(500).json({ error: "Failed to delete product" }))
      }
    }
    next()
  })

  server.use((req, res, next) => {
    if (req.path.startsWith("/users")) {
      const user = req.user // Extracted from json-server-auth
      console.log(user)
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      // Allow admin to access all users
      if (user.role === "admin") {
        return next()
      }

      // Extract userId from URL
      const userIdFromUrl = Number(req.path.split("/")[2])

      // Allow users to access only their own data
      if (req.method === "GET" && userIdFromUrl === user.id) {
        return next()
      }

      return res.status(403).json({ error: "Access denied" })
    }

    next()
  })

  // Add authentication middleware
  server.db = router.db
  const rules = auth.rewriter({
    users: 640, // Only admins can access users
    wishlist: 640,
    // cart: 640, // Users must be logged in to access cart
    orders: 640, // Users must be logged in to access orders
    products: 644, // Public can read, but only logged-in users can modify
    categories: 644, // Public can read, but only logged-in users can modify
  })

  server.use(rules)
  server.use(auth)
  server.use(router)

  server.listen(port, "0.0.0.0", () => {
    console.log(`JSON Server running on http://localhost:${port} using ${file}`)
  })
})

// Start server
// const PORT = 3000
// server.listen(PORT, () => {
//   console.log(`JSON Server is running at http://localhost:${PORT}`)
// })
