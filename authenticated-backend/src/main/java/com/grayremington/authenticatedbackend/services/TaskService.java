package com.grayremington.authenticatedbackend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grayremington.authenticatedbackend.models.Task;
import com.grayremington.authenticatedbackend.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getAllTasksByTaskAuthor(String taskAuthor) {
        return taskRepository.findAllTasksByTaskAuthor(taskAuthor);
    }
   
     public Task updateTaskCompletion(Integer taskId, Boolean completed) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task != null) {
            task.setCompleted(completed);
            return taskRepository.save(task);
        }
        return null;
    }


    public Task getTaskById(Integer taskId) {
        return taskRepository.findById(taskId).orElse(null);
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public void deleteTaskById(Integer taskId) {
        taskRepository.deleteById(taskId);
    }

    public void deleteAllBYIds(List<Integer> integers) {
    taskRepository.deleteByIdIn(integers);
}


    // Add other business logic methods related to tasks
}
