'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface File {
  id: string;
  name: string;
  created_at: string;
}

const FileList: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching files',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setFiles(data || []);
    }
  };

  const handleDownload = async (id: string, name: string) => {
    const { data, error } = await supabase.storage.from('files').download(id);
    if (error) {
      toast({
        title: 'Error downloading file',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('files').delete().match({ id });
    if (error) {
      toast({
        title: 'Error deleting file',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'File deleted successfully',
      });
      fetchFiles();
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.id}>
            <TableCell>{file.name}</TableCell>
            <TableCell>{new Date(file.created_at).toLocaleString()}</TableCell>
            <TableCell>
              <Button
                onClick={() => handleDownload(file.id, file.name)}
                className="mr-2"
              >
                Download
              </Button>
              <Button
                onClick={() => handleDelete(file.id)}
                variant="destructive"
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FileList;
