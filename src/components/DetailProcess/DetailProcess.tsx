import React from 'react';
import { ProcessT } from '../../types/types'; 

type ProcessDetailProps = {
  process: ProcessT;
  updateProcessDetail: (field: string, value: string) => void;
  saveDetails:() => void;
};


const ProcessDetail: React.FC<ProcessDetailProps> = ({ process, updateProcessDetail, saveDetails }) => {
  debugger
  return (
    <div className="card mb-4  border-0">
      <div className="card-header bg-white">
        <h5 className="card-title"><b>Detalhes do processo</b></h5>
        <h6 className="card-subtitle text-muted">Veja os detalhes do processo selecionado</h6>
      </div>
      <div className="card-body">
        <div className="mt-4">
          <div className="mb-3">
            <label htmlFor="process-name" className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              id="process-name"
              value={process.name}
              onChange={(e) => updateProcessDetail('name', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tools" className="form-label">Softwares e Ferramentas</label>
            <input
              type="text"
              className="form-control"
              id="tools"
              value={process.tools}
              onChange={(e) => updateProcessDetail('tools', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="responsible" className="form-label">Responsáveis</label>
            <input
              type="text"
              className="form-control"
              id="responsible"
              value={process.responsible}
              onChange={(e) => updateProcessDetail('responsible', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="documentation" className="form-label">Documentação</label>
            <textarea
              className="form-control"
              id="documentation"
              value={process.documentation}
              onChange={(e) => updateProcessDetail('documentation', e.target.value)}
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="process-systemic"
              checked={process.isSystemic}
              onChange={(e) => updateProcessDetail('isSystemic', e.target.checked ? 'true' : 'false')}
            />
            <label className="form-check-label" htmlFor="process-systemic">Processo Sistemico</label>
          </div>
          <div className="mb-3">
            <button className='btn btn-primary' onClick={() => saveDetails()}> Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessDetail;
