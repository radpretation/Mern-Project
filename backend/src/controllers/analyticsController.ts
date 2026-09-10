import { Request, Response } from 'express';
import { Questionnaire, EvidenceReview } from '../models';

export class AnalyticsController {
  public async getProcessStats(req: Request, res: Response): Promise<void> {
    try {
      const { serviceId, customerId, processId } = req.body;
      const numServiceId = Number(serviceId);

      const totalQuestions = await Questionnaire.countDocuments({ serviceId: numServiceId, status: '1' });

      const reviews = await EvidenceReview.find({
        serviceId: numServiceId,
        customerId,
        processId,
      });

      const attempted = reviews.filter((r) => r.questCheckedVal === 'on').length;
      const notAttempted = Math.max(0, totalQuestions - attempted);

      const assignedToQsa = reviews.filter((r) => r.status === 0 || r.firstStatus === 1).length;
      const assignedToQa = reviews.filter((r) => r.status === 1).length;
      const approvedByQa = reviews.filter((r) => r.qaStatus === 1).length;
      const disapprovedByQsa = reviews.filter((r) => r.status === 2).length;
      const disapprovedByQa = reviews.filter((r) => r.qaStatus === 2).length;
      const markedIncomplete = reviews.filter((r) => r.qaStatus === 4 || r.status === 4).length;

      // Legacy CSV string format for strict parity:
      // "Total, Attempted, Rejected, Approved, Approved+Rejected, AssignedToQSA, AssignedToQA, Incomplete, DisapprovedByQSA, DisapprovedByQA"
      const csvString = `${totalQuestions},${attempted},${disapprovedByQa + disapprovedByQsa},${approvedByQa},${approvedByQa + disapprovedByQa},${assignedToQsa},${assignedToQa},${markedIncomplete},${disapprovedByQsa},${disapprovedByQa}`;

      res.status(200).json({
        success: true,
        stats: {
          totalQuestions,
          attempted,
          notAttempted,
          assignedToQsa,
          assignedToQa,
          approvedByQa,
          disapprovedByQsa,
          disapprovedByQa,
          markedIncomplete,
        },
        csvString,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const analyticsController = new AnalyticsController();
