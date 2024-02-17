const payAppointment = (req, res) => {
     const id = req.params.id;
     const db = req.db;
     const appointment = db.collection('rendez_vous').findOne({ _id: id });

     if (appointment) {
          if (appointment.status.code === 'TEP') return res.status(400).send('Payment already done');

          const payment = db.collection('paiement').insertOne({ appointmentId: id, amount: appointment.amount, status: 'PENDING' });
          res.send(payment);
     } else {
          res.status(404).send('Appointment not found');
     }
}
