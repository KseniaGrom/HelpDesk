import './styles.css';
import API from './api';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import TicketDetails from './components/TicketDetails';

class HelpDeskApp {
    constructor() {
        this.api = new API();
        this.ticketList = new TicketList(
            this.api,
            this.handleEdit.bind(this),
            this.handleDelete.bind(this),
            this.handleToggleStatus.bind(this)
        );
        this.ticketForm = new TicketForm(
            this.api,
            this.handleFormSubmit.bind(this),
            null
        );
        this.ticketDetails = new TicketDetails(this.api);
        
        this.init();
    }
    
    init() {
        this.loadTickets();
        this.setupEventListeners();
    }
    
    loadTickets() {
        this.ticketList.render();
    }
    
    setupEventListeners() {
        const addBtn = document.getElementById('addTicketBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.ticketForm.show();
            });
        }
    }
    
    handleEdit(ticket) {
        this.ticketForm.show(ticket);
    }
    
    handleDelete(ticket) {
        this.ticketDetails.showDeleteConfirm(ticket, () => {
            this.loadTickets();
        });
    }
    
    async handleToggleStatus(ticket) {
        try {
            await this.api.updateTicket(
                ticket.id, 
                ticket.name, 
                ticket.description, 
                !ticket.status
            );
            this.loadTickets();
        } catch (error) {
            console.error('Ошибка изменения статуса:', error);
            alert('Ошибка при изменении статуса: ' + error.message);
        }
    }
    
    handleFormSubmit() {
        this.loadTickets();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new HelpDeskApp();
    });
} else {
    const app = new HelpDeskApp();
}