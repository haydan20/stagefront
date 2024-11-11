import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Area } from '../../types/types';
import Layout from '../../components/layout';
import './oraculo.css';

const Oraculo: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const getAnswer = async (area: string, question: string) => {
    const objAreas = areas.filter((x) => x.name === selectedArea);

    const response = await fetch(`${process.env.REACT_APP_API_URL_}/areas/getareasinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ objAreas, question }),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar subprocesso');
    }

    return await response.json();
  };


  const fetchAreas = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_}/areas`);
      if (!response.ok) {
        throw new Error('Erro ao obter as áreas');
      }
      const areasData = await response.json();
      setAreas(areasData);
    } catch (error) {
      console.error('Falha na requisição GET:', error);
    }
  };


  useEffect(() => {
    fetchAreas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea || !question) {
      setError('Please select a business area and enter a question.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getAnswer(selectedArea, question);
      setAnswer(response);
    } catch (err) {
      setError('An error occurred while fetching the answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-5 oraculo-container">
        <h1 className="mb-4 oraculo-title">Oráculo</h1>
        <div className="card oraculo-card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="businessArea" className="form-label oraculo-label">Selecione</label>
                <select
                  id="businessArea"
                  className="form-select oraculo-select"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  required
                >
                  <option value="">Escolha a área</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="question" className="form-label oraculo-label">Qual sua dúvida?</label>
                <textarea
                  id="question"
                  className="form-control oraculo-textarea"
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Faça uma pergunta"
                  required
                />
              </div>

              <button className="btn oraculo-btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Aguarde...' : 'Perguntar ao Oráculo'}
              </button>
            </form>

            {error && (
              <div className="alert alert-danger mt-3 oraculo-alert">
                {error}
              </div>
            )}

            {answer && (
              <div className="card mt-4 oraculo-answer-card">
                <div className="card-body">
                  <p className="card-text oraculo-answer-text" style={{ whiteSpace: 'pre-line' }}>{answer}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Oraculo;
