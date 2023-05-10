require('dotenv').config()

const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

let nextEmp = 5

module.exports = {
    getUpcomingAppointments: (req, res) => {
        sequelize.query(`select a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    approveAppointment: (req, res) => {
        let {apptId} = req.body
    
        sequelize.query(`*****YOUR CODE HERE*****
        
        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    },

    getAllClients: (req, res) => {
        sequelize.query(`
            SELECT * FROM cc_users
            JOIN cc_clients
            ON cc_users.user_id = cc_clients.user_id
        `).then(dbRes => res.status(200).send(dbRes[0])).catch()
    },

    getPendingAppointments: (req, res) => {
        sequelize.query(`
            SELECT *
            FROM cc_appointments
            WHERE approved = false
            ORDER BY date DESC
        `).then(dbRes => res.status(200).send(dbRes[0])).catch()
    },

    
    getPastAppointments: (req, res) => {
        sequelize.query(`
            SELECT cc_appointments.appt_id, cc_appointments.date, cc_appointments.service_type, cc_appointments.notes, cc_users.first_name, cc_users.last_name
            FROM cc_appointments
            JOIN cc_clients
            ON approved = true
            AND completed = true
            AND cc_clients.client_id = cc_appointments.client_id
            JOIN cc_users
            ON cc_clients.user_id = cc_users.user_id
            ORDER BY 2 DESC
        `).then(dbRes => res.status(200).send(dbRes[0])).catch()
    }
}

