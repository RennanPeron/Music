<template>
    <li class="p-6 bg-gray-50 border border-gray-200 comment-item" v-for="item in sortedList" :key="item.docID">
        <!-- Comment Author -->
        <div class="mb-5">
            <div class="font-bold">{{ item.author }}</div>
            <time>{{ getTimeDiff(new Date(item.datePosted)) }}</time>
        </div>

        <p>
            {{ item.comment }}
        </p>
    </li>
</template>

<script>
import sortList from '@/mixins/sortList'

export default {
    name: 'CommentItem',
    mixins: [sortList],
}
</script>