import { Response } from 'express';
import { AuditComment, CustomerProcess } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserType } from '../constants/roles';
import { formatErrorMessage } from '../utils/formatError';

export class CommentController {
  public async addComment(req: AuthRequest, res: Response): Promise<void> {
    try {
      let { questionId, serviceId, processId, customerId, comment } = req.body;
      const user = req.user!;

      if (!comment || !comment.trim()) {
        res.status(400).json({ success: false, message: 'Comment text is required.' });
        return;
      }

      // If customerId is not provided or empty string, resolve it
      if (!customerId || customerId === '') {
        if (user.userType === UserType.CUSTOMER) {
          customerId = user.parentId || user._id;
        } else if (processId) {
          const proc = await CustomerProcess.findById(processId);
          if (proc) {
            customerId = proc.customerId;
          }
        }
      }

      const newComment = new AuditComment({
        questionId,
        serviceId: Number(serviceId),
        processId,
        customerId,
        loginUserId: user._id,
        comments: comment.trim(),
        loginUserDate: new Date(),
      });

      await newComment.save();
      await newComment.populate('loginUserId', 'fullName userType email');

      res.status(201).json({ success: true, message: 'Comment posted.', comment: newComment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: formatErrorMessage(error) });
    }
  }

  public async getComments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { questionId, serviceId, processId } = req.query;
      let customerId = req.query.customerId as string;
      const user = req.user!;

      const query: any = {
        questionId,
        serviceId: Number(serviceId),
        processId,
      };

      if (customerId && customerId !== '') {
        query.customerId = customerId;
      } else if (user.userType === UserType.CUSTOMER) {
        query.customerId = user.parentId || user._id;
      }

      const comments = await AuditComment.find(query)
        .populate('loginUserId', 'fullName userType email')
        .sort({ createdAt: 1 });

      res.status(200).json({ success: true, comments });
    } catch (error: any) {
      res.status(500).json({ success: false, message: formatErrorMessage(error) });
    }
  }
}

export const commentController = new CommentController();

