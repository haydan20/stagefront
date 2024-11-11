import React from 'react';
import { ChevronRight, ChevronDown, GearWideConnected, FileText, ChevronUp, ChevronDown as ChevronDownIcon, Plus, Trash2 } from 'react-bootstrap-icons';
import { ProcessT } from '../../types/types';

interface ProcessListProps {
  processes: ProcessT[];
  selectedProcessPath: string[] | null;
  collapsedProcesses: Set<string>;
  toggleCollapse: (processId: string) => void;
  setSelectedProcessPath: (path: string[]) => void;
  addSubprocess: (parentProcessId: string, subprocess: ProcessT) => void;
  moveProcess: (processId: string, direction: 'up' | 'down') => void;
  removeProcess: (processId: string) => void;
}

const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  selectedProcessPath,
  collapsedProcesses,
  toggleCollapse,
  setSelectedProcessPath,
  addSubprocess,
  moveProcess,
  removeProcess,
}) => {

  
  const addSubprocessToBackend = async (parentProcessId: string, subprocess: ProcessT) => {
    try {
      debugger
      const response = await fetch(`${process.env.REACT_APP_API_URL_}/processes/addSubprocessToProcess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({subprocess,parentProcessId}),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar subprocesso');
      }

      const addedSubprocess = await response.json();
      addSubprocess(parentProcessId, addedSubprocess);
    } catch (error) {
      console.error('Falha na requisição POST:', error);
    }
  };



  // Função para remover um processo no backend
  const removeProcessFromBackend = async (processId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_}/api/processes/${processId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao remover processo');
      }

      removeProcess(processId);
    } catch (error) {
      console.error('Falha na requisição DELETE:', error);
    }
  };

  const renderProcesses = (processes: ProcessT[], path: string[]) => {
    debugger
    return processes.map((process, index) => (
      <div key={process._id} style={{ marginLeft: `${path.length * 20}px` }}>
        <div
          className={`d-flex align-items-center p-2 ${selectedProcessPath?.includes(process._id) ? "bg-light" : ""}`}
        >
          {/* Botão de colapso/expansão */}
          <button
            className="btn btn-link p-0 me-2"
            onClick={() => toggleCollapse(process._id)}
            aria-label={collapsedProcesses.has(process._id) ? "Expand" : "Collapse"}
          >
            {process.subprocesses.length > 0 ? (
              collapsedProcesses.has(process._id) ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronDown size={16} />
              )
            ) : (
              <span className="me-2"></span>
            )}
          </button>

          {/* Ícone do processo */}
          {process.isSystemic ? (
            <GearWideConnected size={16} className="me-2" />
          ) : (
            <FileText size={16} className="me-2" />
          )}

          {/* Nome do processo */}
          <span
            className="flex-grow-1 cursor-pointer"
            onClick={() => setSelectedProcessPath([...path, process._id])}
            style={{ fontWeight: selectedProcessPath?.includes(process._id) ? 'bold' : 'normal' }}
          >
            {process.name}
          </span>

          {/* Botão de movimentação para cima */}
          <button
            className="btn btn-link p-0 me-2"
            onClick={() => moveProcess(process._id, 'up')}
            disabled={index === 0}
            aria-label="Move Up"
          >
            <ChevronUp size={16} />
          </button>

          {/* Botão de movimentação para baixo */}
          <button
            className="btn btn-link p-0 me-2"
            onClick={() => moveProcess(process._id, 'down')}
            disabled={index === processes.length - 1}
            aria-label="Move Down"
          >
            <ChevronDownIcon size={16} />
          </button>

          {/* Botão de adição de subprocesso */}
          <button
            className="btn btn-link p-0"
            onClick={() => {
              const name = prompt("Nome do subprocesso");
              if (name) {
                const newSubprocess: ProcessT = {
                  _id: '',
                  name,
                  subprocesses: [],
                  tools: "",
                  responsible: "",
                  documentation: "",
                  isSystemic: false,
                };
                addSubprocessToBackend(process._id, newSubprocess);
              }
            }}
            aria-label="Add Subprocess"
          >
            <Plus size={16} />
          </button>

          {/* Botão de remoção do processo */}
          <button
            className="btn btn-link text-danger p-0"
            onClick={() => removeProcessFromBackend(process._id)}
            aria-label="Remove Process"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Renderizar subprocessos recursivamente */}
        {!collapsedProcesses.has(process._id) && process.subprocesses.length > 0 && (
          renderProcesses(process.subprocesses, [...path, process._id])
        )}
      </div>
    ));
  };

  return <>{renderProcesses(processes, [])}</>;
};

export default ProcessList;
