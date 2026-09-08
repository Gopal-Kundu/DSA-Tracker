package com.gopalkundu.leettracker.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gopalkundu.leettracker.entity.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String>{
    
}
