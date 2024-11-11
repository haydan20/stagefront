import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import "./area.css";
import { Area } from '../../types/types';


interface AreasProps {
  areas: Area[];
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>;
  setSelectedArea: React.Dispatch<React.SetStateAction<string | null>>;
}

const Areas: React.FC<AreasProps> = ({ areas, setAreas, setSelectedArea }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [areaFilter, setAreaFilter] = useState("");
  const itemsPerPage = 5;

  const filteredAreas = useMemo(() => {
    return areas.filter(area => area.name.toLowerCase().includes(areaFilter.toLowerCase()));
  }, [areas, areaFilter]);

  const paginatedAreas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAreas.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAreas, currentPage]);

  const totalPages = Math.ceil(filteredAreas.length / itemsPerPage);

  // Função para obter as áreas do backend
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

  // Função para adicionar uma nova área
  const addArea = async (name: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_}/areas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar área');
      }

      const newArea = await response.json();
      setAreas((prevAreas) => [...prevAreas, newArea]);
    } catch (error) {
      console.error('Falha na requisição POST:', error);
    }
  };

  
  useEffect(() => {
    fetchAreas();
  }, []); 

  return (
    <div className="card mb-4  border-0">
      <div className="card-header bg-white">
        <h5 className="card-title"><b>Áreas</b></h5>
        <h6 className="card-subtitle text-muted">Gerencie suas áreas e processos de negócio</h6>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="new-area" className="form-label"><b>Nova Área</b></label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="new-area"
              placeholder=""
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addArea((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
            <button
              className="btn bg-black text-white"
              onClick={() => {
                const input = document.getElementById("new-area") as HTMLInputElement;
                addArea(input.value);
                input.value = "";
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="area-filter" className="form-label">Filtrar Áreas</label>
          <input
            type="text"
            className="form-control"
            id="area-filter"
            placeholder=""
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAreas.map((area) => (
              <tr key={area._id}>
                <td>{area.name}</td>
                <td>
                  <button className="btn btn-area-verprocessos" onClick={() => setSelectedArea(area._id)}>
                    Ver Processos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} className="me-2" />
            
          </button>
          <span> {currentPage} de {totalPages}</span>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            
            <ChevronRight size={16} className="ms-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Areas;
