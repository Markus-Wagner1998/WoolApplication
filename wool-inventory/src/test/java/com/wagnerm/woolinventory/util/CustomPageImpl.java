package com.wagnerm.woolinventory.util;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CustomPageImpl<T> extends PageImpl<T> {
    private static final long serialVersionUID = 1L;
    private int number;
    private int size;
    private int totalPages;
    private int numberOfElements;
    private long totalElements;
    private boolean previousPage;
    private boolean firstPage;
    private boolean nextPage;
    private boolean lastPage;
    private List<T> content;
    private Sort sort;

    public CustomPageImpl() {
        super(new ArrayList<>());
    }

    public Page<T> pageImpl() {
        return new PageImpl<>(getContent(), PageRequest.of(getNumber(),
                                                           getSize(), getSort()), getTotalElements());
    }
}
