import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../../components/layout';
import Areas from '../../components/Area/Area';
import ProcessList from '../../components/ProcessList/ProcessList';
import ProcessDetail from '../../components/DetailProcess/DetailProcess';
import { ProcessT, Area } from '../../types/types';

const ProcessMap: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedProcessPath, setSelectedProcessPath] = useState<string[] | null>(null);
  const [collapsedProcesses, setCollapsedProcesses] = useState<Set<string>>(new Set());

  // Encontrar o processo/subprocesso com base no selectedProcessPath
  const getSelectedProcess = () => {
    if (!selectedProcessPath || !selectedArea) return null;
    let processes = areas.find(a => a._id === selectedArea)?.processes;
    if (!processes) return null;

    for (const processId of selectedProcessPath) {
      const process: any = processes?.find(p => p._id === processId);
      if (!process) return null;
      if (processId === selectedProcessPath[selectedProcessPath.length - 1]) {
        return process;
      }
      processes = process.subprocesses;
    }
    return null;
  };

  // Adiciona um processo na área 
  const addProcess = async (areaId: string, processT: ProcessT) => {
    debugger
    try {
      // Enviando o processo para o backend via POST
      const response = await fetch(`${process.env.REACT_APP_API_URL_}/api/processes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ processT, areaId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar o processo.');
      }

      // Atualizando o estado local se o processo for adicionado com sucesso
      const updatedArea = await response.json();

      setAreas(updatedArea)

      setAreas(
        areas.map((area) => {
          debugger
          if (area._id === areaId) {
            return { ...area, processes: [...area.processes, updatedArea.processes[updatedArea.processes.length - 1]] };
          }
          return area;
        })
      );
    } catch (error) {
      console.error('Erro ao adicionar processo:', error);
    }
  };


  const addSubprocess = (parentProcessId: string, subprocess: ProcessT) => {
    setAreas(
      areas.map((area) => {
        if (area._id === selectedArea) {
          return {
            ...area,
            processes: addSubprocessRecursively(area.processes, parentProcessId, subprocess),
          };
        }
        return area;
      })
    );
  };

  const addSubprocessRecursively = (processes: ProcessT[], parentId: string, newSubprocess: ProcessT): ProcessT[] => {
    return processes.map((process) => {
      if (process._id === parentId) {
        return { ...process, subprocesses: [...process.subprocesses, newSubprocess] };
      }
      if (process.subprocesses.length > 0) {
        return {
          ...process,
          subprocesses: addSubprocessRecursively(process.subprocesses, parentId, newSubprocess),
        };
      }
      return process;
    });
  };


  const updateProcess = async (processes: ProcessT[], processId: string) => {
 
  
    // Função recursiva para buscar o processo pelo ID, incluindo subprocessos
    const findProcessById = (processList: ProcessT[], id: string): ProcessT | null => {
      for (const process of processList) {
        if (process._id === id) {
          return process;
        }
        if (process.subprocesses && process.subprocesses.length > 0) {
          const found = findProcessById(process.subprocesses, id);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };
  
    // Buscar o processo alvo usando a função recursiva
    const targetProcess = findProcessById(processes, processId);
  
    // Se o processo ou subprocesso não for encontrado, lançar um erro
    if (!targetProcess) {
      throw new Error('Processo ou subprocesso não encontrado.');
    }
  
    // Enviar a requisição para atualizar o processo ou subprocesso encontrado
    const response = await fetch(`${process.env.REACT_APP_API_URL_}/processes/${targetProcess._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetProcess }),
    });
  
    if (!response.ok) {
      throw new Error('Erro ao atualizar o processo.');
    }
  };
  


  const updateProcessRecursively = (processes: ProcessT[], processId: string, updatedProcess: Partial<ProcessT>): ProcessT[] => {
    debugger
    return processes.map((process) => {
      debugger
      if (process._id === processId) {
        return { ...process, ...updatedProcess };
      }
      if (process.subprocesses.length > 0) {
        return {
          ...process,
          subprocesses: updateProcessRecursively(process.subprocesses, processId, updatedProcess),
        };
      }
      return process;
    });
  };

  const removeProcess = (processId: string) => {
    setAreas(
      areas.map((area) => {
        if (area._id === selectedArea) {
          return {
            ...area,
            processes: removeProcessRecursively(area.processes, processId),
          };
        }
        return area;
      })
    );
  };

  const removeProcessRecursively = (processes: ProcessT[], processId: string): ProcessT[] => {
    debugger
    return processes.filter((process) => {
      if (process._id === processId) {
        return false;
      }
      if (process.subprocesses.length > 0) {
        process.subprocesses = removeProcessRecursively(process.subprocesses, processId);
      }
      return true;
    });
  };

  const toggleCollapse = (processId: string) => {
    setCollapsedProcesses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(processId)) {
        newSet.delete(processId);
      } else {
        newSet.add(processId);
      }
      return newSet;
    });
  };

  const moveProcess = (processId: string, direction: 'up' | 'down') => {
    debugger
    setAreas(
      areas.map((area) => {
        if (area._id === selectedArea) {
          return {
            ...area,
            processes: moveProcessRecursively(area.processes, processId, direction),
          };
        }
        return area;
      })
    );
  };

  const moveProcessRecursively = (processes: ProcessT[], processId: string, direction: 'up' | 'down'): ProcessT[] => {
    debugger
    const index = processes.findIndex(p => p._id === processId);
    if (index !== -1) {
      const newProcesses = [...processes];
      const [removed] = newProcesses.splice(index, 1);
      newProcesses.splice(direction === 'up' ? index - 1 : index + 1, 0, removed);
      return newProcesses;
    }
    return processes.map(process => ({
      ...process,
      subprocesses: moveProcessRecursively(process.subprocesses, processId, direction),
    }));
  };

  const updateProcessDetail = (field: string, value: string) => {
    debugger
    if (selectedProcessPath) {
      setAreas(
        areas.map((area) => {
          if (area._id === selectedArea) {
            debugger
            return {
              ...area,
              processes: updateProcessRecursively(area.processes, selectedProcessPath[selectedProcessPath.length - 1], { [field]: value }),
            };
          }
          return area;
        })
      );
    }
  };

  const saveDeatails = () => {
    
    if(selectedProcessPath)
    areas.map((area) => {
  
      if (area._id === selectedArea) {
        updateProcess(area.processes,selectedProcessPath[selectedProcessPath.length - 1])
        alert("Processo salvo com sucesso!");
      }

    })
    
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <Areas areas={areas} setAreas={setAreas} setSelectedArea={setSelectedArea} />
          </div>
          <div className="col-md-6">
            <div className="card mb-4 border-0">
              <div className="card-header bg-white">
                <h5 className="card-title"><b>Processos</b></h5>
                <h6 className="card-subtitle text-muted">Gerencia seus processos empresariais</h6>
              </div>
              <div className="card-body">
                {selectedArea && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="new-process" className="form-label">Novo Processo</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          id="new-process"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addProcess(selectedArea, {
                                _id: Date.now().toString(),
                                name: (e.target as HTMLInputElement).value,
                                subprocesses: [],
                                tools: "",
                                responsible: "",
                                documentation: "",
                                isSystemic: false,
                              });
                              (e.target as HTMLInputElement).value = "";
                            }
                          }}
                        />
                        <button
                          className="btn bg-black text-white"
                          onClick={() => {
                            const input = document.getElementById("new-process") as HTMLInputElement;
                            addProcess(selectedArea, {
                              _id: "",
                              name: input.value,
                              subprocesses: [],
                              tools: "",
                              responsible: "",
                              documentation: "",
                              isSystemic: false,
                            });
                            input.value = "";
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <ProcessList
                      processes={areas.find(a => a._id === selectedArea)?.processes || []}
                      selectedProcessPath={selectedProcessPath}
                      collapsedProcesses={collapsedProcesses}
                      toggleCollapse={toggleCollapse}
                      setSelectedProcessPath={setSelectedProcessPath}
                      addSubprocess={addSubprocess}
                      moveProcess={moveProcess}
                      removeProcess={removeProcess}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {selectedProcessPath && (
              <ProcessDetail
                process={getSelectedProcess()!}
                updateProcessDetail={updateProcessDetail}
                saveDetails={saveDeatails}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProcessMap;
