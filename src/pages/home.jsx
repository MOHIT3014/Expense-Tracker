import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "General",
        date: new Date().toISOString().substring(0, 10),
        type: "expense",
    });

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!loggedInUser) {
            navigate("/login");
        } else {
            setUser(loggedInUser);
            const stored = JSON.parse(localStorage.getItem(loggedInUser.email)) || [];
            setTransactions(stored);
        }
    }, [navigate]);

    const saveTransactions = (updated) => {
        localStorage.setItem(user.email, JSON.stringify(updated));
        setTransactions(updated);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { title, amount, category, date, type } = form;
        if (!title || !amount || !category || !date || !type) {
            toast.warning("Please fill out all fields.");
            return;
        }

        const newTx = {
            id: Date.now(),
            title,
            amount: parseFloat(amount),
            category,
            date,
            type,
        };

        const updated = [newTx, ...transactions];
        saveTransactions(updated);
        toast.success("Transaction added!");
        setShowModal(false);
        setForm({
            title: "",
            amount: "",
            category: "General",
            date: new Date().toISOString().substring(0, 10),
            type: "expense",
        });
    };

    const handleDelete = (id) => {
        const updated = transactions.filter((tx) => tx.id !== id);
        saveTransactions(updated);
        toast.success("Transaction deleted successfully!");
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);

    const chartData = [
        { name: "Income", value: totalIncome },
        { name: "Expense", value: totalExpense }
    ];

    return (
        <div className="container mt-5">
            {user ? (
                <>
                    <h2>Welcome, {user.name} 👋</h2>
                    <h4>Your Dashboard</h4>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card bg-dark text-white shadow">
                                <div className="card-body">
                                    <h5>Total Balance</h5>
                                    <h3>${(totalIncome - totalExpense).toFixed(2)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-success text-white shadow">
                                <div className="card-body">
                                    <h5>Total Income</h5>
                                    <h3>${totalIncome.toFixed(2)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-danger text-white shadow">
                                <div className="card-body">
                                    <h5>Total Expense</h5>
                                    <h3>${totalExpense.toFixed(2)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <h4>💹 Income vs Expense</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#007bff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <Button variant="primary" onClick={() => setShowModal(true)} className="mt-4">
                        + Add New Transaction
                    </Button>

                    <h4 className="mt-5">Recent Transactions</h4>
                    {transactions.length === 0 ? (
                        <p>No transactions yet.</p>
                    ) : (
                        <ul className="list-group">
                            {transactions.slice(0, 5).map(tx => (
                                <li key={tx.id} className={`list-group-item d-flex justify-content-between align-items-center ${tx.type === "expense" ? "list-group-item-danger" : "list-group-item-success"}`}>
                                    <div>
                                        <strong>{tx.title}</strong><br />
                                        <small>{new Date(tx.date).toLocaleDateString()}</small><br />
                                        <small>{tx.category}</small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="me-3">${tx.amount}</span>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(tx.id)}>Delete</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Modal */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Transaction</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleFormSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={form.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Groceries</option>
                                        <option>Transport</option>
                                        <option>Bills</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Check
                                        inline
                                        label="Expense"
                                        type="radio"
                                        name="type"
                                        checked={form.type === "expense"}
                                        value="expense"
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    />
                                    <Form.Check
                                        inline
                                        label="Income"
                                        type="radio"
                                        name="type"
                                        checked={form.type === "income"}
                                        value="income"
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Add
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    <Button variant="danger" onClick={handleLogout} className="mt-3">
                        Logout
                    </Button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Dashboard;
