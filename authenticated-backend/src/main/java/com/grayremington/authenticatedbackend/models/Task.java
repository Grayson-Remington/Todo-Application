package com.grayremington.authenticatedbackend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="tasks")
public class Task {
  
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name="taskId")
  private Integer taskId;

  @Column
  private String taskAuthor;

  @Column
  private String taskTitle;
  
  @Column
  private String taskDescription;

  @Column 
  private Boolean completed;

  public Integer getTaskId() {
    return taskId;
  }

  public void setTaskId(Integer taskId) {
    this.taskId = taskId;
  }

  public String getTaskAuthor() {
    return taskAuthor;
  }

  public void setTaskAuthor(String taskAuthor) {
    this.taskAuthor = taskAuthor;
  }

  public String getTaskTitle() {
    return taskTitle;
  }

  public void setTaskTitle(String taskTitle) {
    this.taskTitle = taskTitle;
  }

  public String getTaskDescription() {
    return taskDescription;
  }

  public void setTaskDescription(String taskDescription) {
    this.taskDescription = taskDescription;
  }

  public Boolean getCompleted() {
    return completed;
  }

  public void setCompleted(Boolean completed) {
    this.completed = completed;
  }



}
