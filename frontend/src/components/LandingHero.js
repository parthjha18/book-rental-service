import { Link } from "react-router-dom"
import { LayoutGroup, motion } from "framer-motion"
import { TextRotate } from "./ui/text-rotate"
import Floating, { FloatingElement } from "./ui/parallax-floating"
import { useAuth } from "../context/AuthContext"

const exampleImages = [
  {
    url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
    title: "Library shelves with books",
  },
  {
    url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80",
    title: "Stack of colorful books",
  },
  {
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
    title: "Open books on table",
  },
  {
    url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80",
    title: "Person reading a book",
  },
  {
    url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80",
    title: "Library interior",
  },
]

export function LandingHero() {
  const { user } = useAuth()
  return (
    <section className="w-full h-screen overflow-hidden flex flex-col items-center justify-center relative bg-black text-white">
      <Floating sensitivity={-0.5} className="h-full">
        <FloatingElement depth={0.5} className="top-[15%] left-[2%] md:top-[25%] md:left-[5%]">
          <motion.img
            src={exampleImages[0].url}
            alt={exampleImages[0].title}
            className="w-16 h-12 sm:w-24 sm:h-16 md:w-28 md:h-20 lg:w-32 lg:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform -rotate-[3deg] shadow-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[0%] left-[8%] md:top-[6%] md:left-[11%]">
          <motion.img
            src={exampleImages[1].url}
            alt={exampleImages[1].title}
            className="w-40 h-28 sm:w-48 sm:h-36 md:w-56 md:h-44 lg:w-60 lg:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform -rotate-12 shadow-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          />
        </FloatingElement>

        <FloatingElement depth={4} className="top-[90%] left-[6%] md:top-[80%] md:left-[8%]">
          <motion.img
            src={exampleImages[2].url}
            alt={exampleImages[2].title}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-64 lg:h-64 object-cover -rotate-[4deg] hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          />
        </FloatingElement>

        <FloatingElement depth={2} className="top-[0%] left-[87%] md:top-[2%] md:left-[83%]">
          <motion.img
            src={exampleImages[3].url}
            alt={exampleImages[3].title}
            className="w-40 h-36 sm:w-48 sm:h-44 md:w-60 md:h-52 lg:w-64 lg:h-56 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rotate-[6deg] rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[78%] left-[83%] md:top-[68%] md:left-[83%]">
          <motion.img
            src={exampleImages[4].url}
            alt={exampleImages[4].title}
            className="w-44 h-44 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rotate-[19deg] rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          />
        </FloatingElement>
      </Floating>

      <div className="flex flex-col justify-center items-center w-[250px] sm:w-[300px] md:w-[500px] lg:w-[700px] z-50">
        <motion.h1
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-center w-full justify-center items-center flex-col flex whitespace-pre leading-tight tracking-tight space-y-1 md:space-y-4"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
        >
          <span>Make reading </span>
          <LayoutGroup>
            <motion.span layout className="flex whitespace-pre">
              <motion.span
                layout
                className="flex whitespace-pre"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                books{" "}
              </motion.span>
              <TextRotate
                texts={[
                  "effortless",
                  "fun",
                  "magical ♥",
                  "inspiring",
                  "affordable",
                  "easy 🚀",
                  "relaxing ✨",
                ]}
                mainClassName="overflow-hidden pr-3 text-orange-500 py-0 pb-2 md:pb-4 rounded-xl"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </motion.span>
          </LayoutGroup>
        </motion.h1>

        <motion.p
          className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center pt-4 sm:pt-8 md:pt-10 lg:pt-12 text-zinc-400"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
        >
          Find, borrow, and read your favorite books with just a few clicks.
        </motion.p>

        <div className="flex flex-row justify-center space-x-4 items-center mt-10 sm:mt-16 md:mt-20">
          {(!user || user.role !== 'admin') && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.7 }}
              whileHover={{ scale: 1.05, transition: { type: "spring", damping: 30, stiffness: 400 } }}
            >
              <Link
                to="/search"
                className="block sm:text-base md:text-lg lg:text-xl font-semibold tracking-tight text-black bg-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full shadow-2xl"
              >
                Browse Books →
              </Link>
            </motion.div>
          )}

          {!user && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.8 }}
              whileHover={{ scale: 1.05, transition: { type: "spring", damping: 30, stiffness: 400 } }}
            >
              <Link
                to="/register"
                className="block sm:text-base md:text-lg lg:text-xl font-semibold tracking-tight text-white border-2 border-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full shadow-2xl hover:bg-white hover:text-black transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
          )}

          {user && user.role !== 'admin' && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.8 }}
              whileHover={{ scale: 1.05, transition: { type: "spring", damping: 30, stiffness: 400 } }}
            >
              <Link
                to="/dashboard"
                className="block sm:text-base md:text-lg lg:text-xl font-semibold tracking-tight text-white border-2 border-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full shadow-2xl hover:bg-white hover:text-black transition-colors"
              >
                My Dashboard
              </Link>
            </motion.div>
          )}

          {user && user.role === 'admin' && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.8 }}
              whileHover={{ scale: 1.05, transition: { type: "spring", damping: 30, stiffness: 400 } }}
            >
              <Link
                to="/admin"
                className="block sm:text-base md:text-lg lg:text-xl font-semibold tracking-tight text-white border-2 border-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full shadow-2xl hover:bg-white hover:text-black transition-colors"
              >
                Admin Panel →
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
