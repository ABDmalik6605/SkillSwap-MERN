import SwapRequest from '../models/SwapRequest.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/mailer.js';

export const createRequest = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      fromUser: req.user._id
    };
    const request = await SwapRequest.create(payload);
    
    // Populate user details for email
    await request.populate('fromUser toUser', 'name email');
    
    // Send email notification to recipient
    try {
      const scheduleText = request.scheduleProposals?.length > 0
        ? request.scheduleProposals.map((s, i) => 
            `${i + 1}. ${new Date(s.proposedTime).toLocaleString()}${s.note ? ` (${s.note})` : ''}`
          ).join('\n')
        : 'No specific times suggested';

      await sendEmail({
        to: request.toUser.email,
        subject: `New Skill Swap Request from ${request.fromUser.name}`,
        text: `
Hello ${request.toUser.name},

${request.fromUser.name} has sent you a skill swap request!

Details:
- They offer: ${request.offeredSkill}
- They want to learn: ${request.requestedSkill}
- Message: ${request.description || 'No message provided'}

Proposed Times:
${scheduleText}

${request.meetingLink ? `Meeting Link: ${request.meetingLink}` : ''}

Log in to SkillSwap to accept or decline this request.

Best regards,
The SkillSwap Team
        `,
        html: `
<h2>New Skill Swap Request</h2>
<p>Hello ${request.toUser.name},</p>
<p><strong>${request.fromUser.name}</strong> has sent you a skill swap request!</p>

<h3>Details:</h3>
<ul>
  <li><strong>They offer:</strong> ${request.offeredSkill}</li>
  <li><strong>They want to learn:</strong> ${request.requestedSkill}</li>
  <li><strong>Message:</strong> ${request.description || 'No message provided'}</li>
</ul>

<h3>Proposed Times:</h3>
<ul>
${request.scheduleProposals?.map((s, i) => 
  `<li>${new Date(s.proposedTime).toLocaleString()}${s.note ? ` (${s.note})` : ''}</li>`
).join('') || '<li>No specific times suggested</li>'}
</ul>

${request.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${request.meetingLink}">${request.meetingLink}</a></p>` : ''}

<p>Log in to SkillSwap to accept or decline this request.</p>

<p>Best regards,<br>The SkillSwap Team</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request creation if email fails
    }
    
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const listRequests = async (req, res, next) => {
  try {
    const filter = {
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }]
    };
    const requests = await SwapRequest.find(filter)
      .populate('fromUser toUser', 'name avatarUrl rating whatsappNumber')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const respondToRequest = async (req, res, next) => {
  try {
    const request = await SwapRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (!request.toUser.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the recipient may respond' });
    }

    request.status = req.body.status;
    await request.save();

    if (req.body.status === 'accepted' && req.body.confirmedSchedule) {
      await Booking.create({
        request: request._id,
        confirmedSchedule: req.body.confirmedSchedule,
        meetingType: req.body.meetingType || 'online',
        durationMinutes: req.body.durationMinutes || 60
      });
    }

    res.json(request);
  } catch (error) {
    next(error);
  }
};
