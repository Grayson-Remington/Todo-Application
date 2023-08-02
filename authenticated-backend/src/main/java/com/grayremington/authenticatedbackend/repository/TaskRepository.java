package com.grayremington.authenticatedbackend.repository;




import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.grayremington.authenticatedbackend.models.Task;

import jakarta.transaction.Transactional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
  List<Task> findAllTasksByTaskAuthor(String taskAuthor);

  @Modifying
  @Transactional
  @Query("DELETE FROM Task t WHERE t.taskId IN (:taskIds)")
  void deleteByIdIn(List<Integer> taskIds);
  
}
