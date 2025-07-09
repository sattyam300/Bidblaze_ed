
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Auction from '@/models/Auction'
import User from '@/models/User'
import { authMiddleware } from '@/utils/auth-middleware'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const { category, status = 'active', page = 1, limit = 10 } = req.query

      const filter: any = { approved: true }
      if (category && category !== 'all') {
        filter.category = category
      }
      if (status) {
        filter.status = status
      }

      const auctions = await Auction.find(filter)
        .populate('seller', 'full_name avatar_url')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))

      const total = await Auction.countDocuments(filter)

      res.status(200).json({
        auctions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      console.error('Error fetching auctions:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const user = await authMiddleware(req)
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      if (user.role !== 'seller' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Only sellers can create auctions' })
      }

      const {
        title,
        description,
        category,
        images,
        startPrice,
        reservePrice,
        duration = 7 // days
      } = req.body

      const startTime = new Date()
      const endTime = new Date()
      endTime.setDate(endTime.getDate() + duration)

      const auction = new Auction({
        title,
        description,
        category,
        images,
        startPrice,
        reservePrice,
        seller: user.userId,
        startTime,
        endTime,
        status: 'pending' // Needs admin approval
      })

      await auction.save()
      await auction.populate('seller', 'full_name avatar_url')

      res.status(201).json({
        message: 'Auction created successfully (pending approval)',
        auction
      })
    } catch (error) {
      console.error('Error creating auction:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
