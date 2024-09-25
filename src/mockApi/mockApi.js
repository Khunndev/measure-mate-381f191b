import { mockTemplates, mockMeasurements, mockUsers } from './mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTemplates = async () => {
  await delay(500);
  return mockTemplates;
};

export const createTemplate = async (name) => {
  await delay(500);
  const newTemplate = { id: String(mockTemplates.length + 1), name };
  mockTemplates.push(newTemplate);
  return newTemplate;
};

export const updateTemplate = async (id, name) => {
  await delay(500);
  const template = mockTemplates.find(t => t.id === id);
  if (template) {
    template.name = name;
    return template;
  }
  throw new Error('Template not found');
};

export const deleteTemplate = async (id) => {
  await delay(500);
  const index = mockTemplates.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTemplates.splice(index, 1);
    return true;
  }
  throw new Error('Template not found');
};

export const saveMeasurement = async (measurement) => {
  await delay(500);
  const newMeasurement = { ...measurement, id: String(mockMeasurements.length + 1) };
  mockMeasurements.push(newMeasurement);
  return newMeasurement;
};

export const login = async (username, password) => {
  await delay(500);
  const user = mockUsers.find(u => u.username === username && u.password === password);
  if (user) {
    return { user: { id: user.id, username: user.username }, token: 'mock-token' };
  }
  throw new Error('Invalid username or password');
};