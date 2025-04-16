import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ExpensePage = () => {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 10;

    const [newTransaction, setNewTransaction] = useState({
        title: "",
        amount: "",
        category: "General",
        date: new Date().toISOString().substring(0, 10),
        type: "expense",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!loggedInUser) {
            navigate("/login");
        } else {
            setUser(loggedInUser);
            const userTransactions = JSON.parse(localStorage.getItem(loggedInUser.email)) || [];
            setTransactions(userTransactions);
        }
    }, [navigate]);

    const handleDelete = (id) => {
        const updatedTransactions = transactions.filter((tx) => tx.id !== id);
        setTransactions(updatedTransactions);
        localStorage.setItem(user.email, JSON.stringify(updatedTransactions));
        toast.success("Transaction deleted successfully!");
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { title, amount, category, date, type } = newTransaction;

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

        const updatedTransactions = [newTx, ...transactions];
        setTransactions(updatedTransactions);
        localStorage.setItem(user.email, JSON.stringify(updatedTransactions));
        toast.success(`${type === "income" ? "Income" : "Expense"} added!`);

        setNewTransaction({
            title: "",
            amount: "",
            category: "General",
            date: new Date().toISOString().substring(0, 10),
            type: "expense",
        });
    };

    // Pagination logic
    const indexOfLastTx = currentPage * transactionsPerPage;
    const indexOfFirstTx = indexOfLastTx - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTx, indexOfLastTx);
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="container mt-5">
            {user ? (
                <>
                    <h2>Welcome, {user.name} 👋</h2>
                    <h4>Your Transactions</h4>

                    {/* Form */}
                    <Form onSubmit={handleFormSubmit} className="mb-4">
                        {/* ... form fields (unchanged) ... */}
                        <Form.Group className="mb-2">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newTransaction.title}
                                onChange={(e) => setNewTransaction({ ...newTransaction, title: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                value={newTransaction.amount}
                                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={newTransaction.category}
                                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                            >
                                <option>General</option>
                                <option>Groceries</option>
                                <option>Transport</option>
                                <option>Bills</option>
                                <option>Salary</option>
                                <option>Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newTransaction.date}
                                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                value={newTransaction.type}
                                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </Form.Select>
                        </Form.Group>

                        <Button type="submit" variant="primary">
                            Add Transaction
                        </Button>
                    </Form>

                    {/* Transaction List with Pagination */}
                    {transactions.length === 0 ? (
                        <p>No transactions available.</p>
                    ) : (
                        <>
                            <ul className="list-group">
                                {currentTransactions.map((tx) => (
                                    <li
                                        key={tx.id}
                                        className={`list-group-item d-flex justify-content-between align-items-center ${tx.type === "expense" ? "list-group-item-danger" : "list-group-item-success"
                                            }`}
                                    >
                                        <div>
                                            <strong>{tx.title}</strong> <br />
                                            <small>{new Date(tx.date).toLocaleString()}</small> <br />
                                            <small>Category: {tx.category}</small>
                                        </div>
                                        <div>
                                            <strong>
                                                {tx.type === "expense" ? "- $" : "+ $"}
                                                {tx.amount}
                                            </strong>
                                        </div>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(tx.id)}
                                        >
                                            Delete
                                        </Button>
                                    </li>
                                ))}
                            </ul>

                            {/* Pagination Buttons */}
                            <div className="d-flex justify-content-between mt-3">
                                <Button variant="secondary" disabled={currentPage === 1} onClick={goToPrevPage}>
                                    ⬅️ Previous
                                </Button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <Button variant="secondary" disabled={currentPage === totalPages} onClick={goToNextPage}>
                                    Next ➡️
                                </Button>
                            </div>
                        </>
                    )}

                    <Button variant="danger" onClick={handleLogout} className="mt-4">
                        Logout
                    </Button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ExpensePage;
