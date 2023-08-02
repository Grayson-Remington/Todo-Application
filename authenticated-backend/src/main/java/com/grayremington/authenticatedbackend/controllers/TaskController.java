package com.grayremington.authenticatedbackend.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.grayremington.authenticatedbackend.models.Task;
import com.grayremington.authenticatedbackend.models.TaskIdsRequest;
import com.grayremington.authenticatedbackend.services.TaskService;


@RestController
@RequestMapping("/tasks")

public class TaskController {


    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    
    @GetMapping("/getAll")
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/list/{taskAuthor}")
    public ResponseEntity<List<Task>> getAllTasksByTaskAuthor(@PathVariable String taskAuthor) {
        List<Task> tasksbyUsername = taskService.getAllTasksByTaskAuthor(taskAuthor);
        if (tasksbyUsername != null) {
            return ResponseEntity.ok(tasksbyUsername);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Integer id) {
        Task task = taskService.getTaskById(id);
        if (task != null) {
            return ResponseEntity.ok(task);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("saveTask")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task savedTask = taskService.saveTask(task);
        return ResponseEntity.ok(savedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id) {
        taskService.deleteTaskById(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{taskId}/complete")
    public ResponseEntity<Task> completeTask(@PathVariable Integer taskId, @RequestBody Boolean completed) {
        Task updatedTask = taskService.updateTaskCompletion(taskId, completed);
        if (updatedTask != null) {
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.notFound().build();
    }


  @DeleteMapping("/deleteSetOfTasks")
    public String delete(@RequestParam("ids") List<Integer> ids) {
        System.out.println("deleting");
        taskService.deleteAllBYIds(ids);
        return String.join(",", ids.stream().map(value ->  Integer.toString(value)).collect(Collectors.toList()));
    }

    // Add other endpoints and mappings for task-related requests


}
