const axios = require('axios');
jest.mock('axios');

// Setup axios mock to handle the axiosClient instance
axios.create = jest.fn(() => axios);

const GlobalApi = require('../GlobalApi').default;

process.env.NEXT_PUBLIC_STRAPI_URL = 'http://localhost:1337';
process.env.NEXT_PUBLIC_STRAPI_API_KEY = 'test-api-key';

describe('GlobalApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategory', () => {
    it('should fetch categories successfully', async () => {
      const mockResponse = {
        data: [{ id: 1, name: 'Category 1' }]
      };
      
      axios.get.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.getCategory();
      expect(result.data).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith('/categories?populate=*');
    });

    it('should handle error when fetching categories fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(GlobalApi.getCategory()).rejects.toThrow('API Error');
    });

    it('should handle empty response when no categories exist', async () => {
      const mockResponse = { data: [] };
      
      axios.get.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.getCategory();
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('getDoctorList', () => {
    it('should fetch the list of doctors', async () => {
      const mockResponse = {
        data: [{ id: 1, name: 'Dr. Smith' }]
      };
      
      axios.get.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.getDoctorList();
      expect(result.data).toEqual(mockResponse);
    });

    it('should handle error when fetching doctors fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(GlobalApi.getDoctorList()).rejects.toThrow('API Error');
    });

    it('should handle empty response when no doctors exist', async () => {
      const mockResponse = { data: [] };
      
      axios.get.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.getDoctorList();
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('getDoctorByCategory', () => {
    it('should fetch doctors by category', async () => {
      const category = 'Cardiologist';
      const mockResponse = {
        data: [{ id: 1, name: 'Dr. Heart' }]
      };
      
      axios.get.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.getDoctorByCategory(category);
      expect(result.data).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/doctors?filters[categories][Name][$in]=${category}&populate=*`)
      );
    });

    it('should handle error when fetching doctors by category fails', async () => {
      const category = 'Cardiologist';
      
      axios.get.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(GlobalApi.getDoctorByCategory(category)).rejects.toThrow('API Error');
    });

    it('should handle empty response when no doctors in the category', async () => {
      const category = 'NonExistentCategory';
      const mockResponse = { data: [] };
      
      axios.get.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.getDoctorByCategory(category);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('getDoctorById', () => {
    it('should fetch a doctor by ID successfully', async () => {
      const docId = '12345';
      const mockResponse = {
        data: {
          data: [{ id: 1, name: 'Dr. John', documentId: '12345' }]
        }
      };
      
      axios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await GlobalApi.getDoctorById(docId);
      expect(result.data).toEqual(mockResponse.data.data[0]);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/doctors?filters[documentId][$eq]=${docId}&populate=*`)
      );
    });

    it('should throw an error when doctor not found', async () => {
      const docId = 'nonexistent';
      const mockResponse = {
        data: {
          data: []
        }
      };
      
      axios.get.mockResolvedValueOnce(mockResponse);
      
      await expect(GlobalApi.getDoctorById(docId)).rejects.toThrow('Doctor not found');
    });

    it('should handle API errors', async () => {
      const docId = '12345';
      
      axios.get.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(GlobalApi.getDoctorById(docId)).rejects.toThrow('API Error');
    });
  });

  describe('bookAppointment', () => {
    it('should book an appointment successfully', async () => {
      const appointmentData = {
        data: {
          doctorId: '12345',
          date: '2023-04-01',
          time: '10:00 AM',
          Email: 'patient@example.com',
          Name: 'John Doe'
        }
      };
      
      const mockResponse = {
        data: { id: 1, ...appointmentData }
      };
      
      axios.post.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.bookAppointment(appointmentData);
      expect(result.data).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith('/appointments', appointmentData);
    });

    it('should handle error when booking an appointment fails', async () => {
      const appointmentData = {
        data: {
          doctorId: '12345',
          date: '2023-04-01',
          time: '10:00 AM',
          Email: 'patient@example.com',
          Name: 'John Doe'
        }
      };
      
      axios.post.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(GlobalApi.bookAppointment(appointmentData)).rejects.toThrow('API Error');
    });

    it('should handle validation errors during appointment booking', async () => {
      const appointmentData = {
        data: {
          doctorId: '12345',
          // Missing required fields
        }
      };
      
      axios.post.mockRejectedValueOnce(new Error('Validation failed'));
      
      await expect(GlobalApi.bookAppointment(appointmentData)).rejects.toThrow('Validation failed');
    });
  });

  describe('getUserBookingList', () => {
    it('should fetch user bookings', async () => {
      const userEmail = 'user@example.com';
      const mockResponse = {
        data: [
          { id: 1, attributes: { Date: '2023-04-01', Time: '10:00 AM' } }
        ]
      };
      
      axios.get.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.getUserBookingList(userEmail);
      expect(result.data).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/appointments?filters[Email][$eq]=${userEmail}&populate[doctor][populate][image]=true`)
      );
    });

    it('should handle error when fetching user bookings fails', async () => {
      const userEmail = 'user@example.com';
      
      axios.get.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(GlobalApi.getUserBookingList(userEmail)).rejects.toThrow('API Error');
    });

    it('should handle empty response when user has no bookings', async () => {
      const userEmail = 'user-no-bookings@example.com';
      const mockResponse = { data: [] };
      
      axios.get.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.getUserBookingList(userEmail);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('deleteBooking', () => {
    it('should delete a booking successfully', async () => {
      const bookingId = '123';
      const mockResponse = {
        data: { id: 123, deleted: true }
      };
      
      axios.delete.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.deleteBooking(bookingId);
      expect(result.data).toEqual(mockResponse);
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining(`/appointments/${bookingId}`)
      );
    });

    it('should handle error when deleting a booking fails', async () => {
      const bookingId = '123';
      
      axios.delete.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(GlobalApi.deleteBooking(bookingId)).rejects.toThrow('API Error');
    });

    it('should handle error when booking to delete is not found', async () => {
      const bookingId = 'nonexistent';
      
      axios.delete.mockRejectedValueOnce(new Error('Booking not found'));
      
      await expect(GlobalApi.deleteBooking(bookingId)).rejects.toThrow('Booking not found');
    });
  });

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      const emailData = {
        to: 'patient@example.com',
        subject: 'Appointment Confirmation',
        body: 'Your appointment has been confirmed.',
        Name: "John Doe",
        Email: "patient@example.com",
        date: "2023-04-01",
        time: "10:00 AM",
        doctorId: "12345"
      };
      
      const mockResponse = {
        data: {
          id: 1,
          data: {
            Name: "John Doe",
            Email: "patient@example.com",
            date: "2023-04-01",
            time: "10:00 AM",
            doctorId: "12345"
          }
        }
      };
      
      axios.post.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await GlobalApi.sendEmail(emailData);
      expect(result.data).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith('/api/sendEmail', emailData);
    });

    it('should handle error when sending email fails', async () => {
      const emailData = {
        to: 'patient@example.com',
        subject: 'Appointment Confirmation',
        body: 'Your appointment has been confirmed.'
      };
      
      axios.post.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(GlobalApi.sendEmail(emailData)).rejects.toThrow('API Error');
    });

    it('should handle validation errors in email data', async () => {
      const emailData = {
        // Missing required fields
      };
      
      axios.post.mockRejectedValueOnce(new Error('Validation failed'));
      
      await expect(GlobalApi.sendEmail(emailData)).rejects.toThrow('Validation failed');
    });
  });
});