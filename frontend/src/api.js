export default class API {
    constructor() {
        this.baseUrl = 'http://localhost:7070';
    }
    
    async request(method, params = {}, body = null) {
        let url = `${this.baseUrl}?method=${method}`;
        
        if (params.id) {
            url += `&id=${params.id}`;
        }
        
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        if (method === 'createTicket' || method === 'updateById') {
            options.method = 'POST';
            if (body) {
                options.body = JSON.stringify(body);
            }
        }
        
        try {
            const response = await fetch(url, options);
            
            if (method === 'deleteById' && response.status === 204) {
                return { success: true };
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    async getAllTickets() {
        return await this.request('allTickets');
    }
    
    async getTicketById(id) {
        return await this.request('ticketById', { id });
    }
    
    async createTicket(name, description, status = false) {
        const ticket = { name, description: description || "", status };
        return await this.request('createTicket', {}, ticket);
    }
    
    async updateTicket(id, name, description, status) {
        const ticket = { name, description: description || "", status };
        return await this.request('updateById', { id }, ticket);
    }
    
    async deleteTicket(id) {
        return await this.request('deleteById', { id });
    }
}