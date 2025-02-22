"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { MessageSquare, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black from-background to-muted py-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 pt-[12px]">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-semibold">Welcome to KeyedIn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <motion.div whileHover={{ scale: 1.0 }} whileTap={{ scale: 0.98 }}>
              <Link href="/create-room" className="w-full">
                <Button className="w-full text-lg py-8 space-x-4" size="lg">
                  {/* <Users className="w-6 h-6" /> */}
                  <span>Create Room</span>
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.0 }} whileTap={{ scale: 0.98 }}>
              <Link href="/join-room" className="w-full">
                <Button variant="outline" className="w-full text-lg py-8 space-x-4" size="lg">
                  {/* <MessageSquare className="w-6 h-6" /> */}
                  <span>Join Room</span>
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
