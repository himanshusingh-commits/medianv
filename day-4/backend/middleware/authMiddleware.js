
const patientMiddleware = (req, res, next) => {
    const { fname, Last, email, DOB, phone, gender, preference } = req.body;
    const userId = Number(req.params.id);

    const emailExists = users.find(u => u.email === email && u.id !== userId);
    if (emailExists) return res.status(400).json({ error: 'Email already exists' });

    if (!fname || fname.length <= 3 || !Last || Last.length <= 3) {
        return res.status(400).json({ message: "Names must be > 3 chars" });
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) return res.status(400).json({ message: "Invalid email" });

    const phoneStr = String(phone);
    if (phoneStr.length !== 10 || !['8', '9'].includes(phoneStr[0])) {
        return res.status(400).json({ message: "Phone must start with 8 or 9" });
    }

    const inputDate = new Date(DOB);
    if (isNaN(inputDate.getTime()) || inputDate > new Date()) {
        return res.status(400).json({ message: "Invalid DOB" });
    }

    if (!existingPreferences.includes(preference)) {
        return res.status(400).json({ message: "Preference invalid" });
    }

    //const prefRepeat = users.find(u => u.preference === preference && u.id !== userId);
    //if (prefRepeat) return res.status(400).json({ message: "Preference taken" });

    if (!['M', 'F', 'O'].includes(gender)) return res.status(400).json({ message: "Invalid gender" });

    next();
};

export default patientMiddleware;