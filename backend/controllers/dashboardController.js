const Student = require('../models/Student');

exports.getStats = async (req, res) => {
    try {
        const total = await Student.countDocuments();
        const leadCount = await Student.countDocuments({ isAdmitted: false });
        const admittedCount = await Student.countDocuments({ isAdmitted: true });
        const interestedCount = await Student.countDocuments({ reply: 'Interested' });
        const pendingReminders = await Student.countDocuments({ remind: true });

        const successRate = total > 0 ? ((admittedCount / total) * 100).toFixed(1) : 0;

        const studentData = [
            { name: 'Leads', count: leadCount },
            { name: 'Admitted', count: admittedCount },
            { name: 'Interested', count: interestedCount },
            { name: 'Pending', count: pendingReminders },
        ];

        res.json({
            totalStudents: total,
            leadCount,
            interestedCount,
            pendingReminders,
            successRate,
            overallPerformance: successRate > 70 ? 'A' : 'B',
            studentData
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
